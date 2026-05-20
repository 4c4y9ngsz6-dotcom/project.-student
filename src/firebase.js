// ================================================================
// 🔥 FIREBASE INTEGRATION
// قبل تشغيل الموقع: املأ firebaseConfig بالقيم من Firebase Console
// راجع ملف FIREBASE_SETUP.md للتعليمات الكاملة
// ================================================================

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  where,
  serverTimestamp,
  getCountFromServer,
} from 'firebase/firestore';

// ================================================================
// 🔧 املأ هنا من Firebase Console → Project Settings → Web App
// ================================================================
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_PROJECT.firebaseapp.com",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_PROJECT.appspot.com",
  messagingSenderId: "REPLACE_WITH_YOUR_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { onAuthStateChanged };

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// ================================================================
// AUTHENTICATION
// ================================================================
async function ensureUserDoc(user, overrides = {}) {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      fullName: overrides.fullName || user.displayName || user.email?.split('@')[0] || 'مستخدم',
      email: user.email || null,
      photoURL: user.photoURL || null,
      provider: overrides.provider || user.providerData[0]?.providerId || 'unknown',
      joinedAt: serverTimestamp(),
      totalAttempts: 0,
    });
  } else {
    // Update lastSeen without overwriting joinedAt
    await setDoc(userRef, { lastSeen: serverTimestamp() }, { merge: true });
  }
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  await ensureUserDoc(result.user, { provider: 'google.com' });
  return result.user;
}

export async function signInWithGithub() {
  const result = await signInWithPopup(auth, githubProvider);
  await ensureUserDoc(result.user, { provider: 'github.com' });
  return result.user;
}

export async function signUpWithEmail(email, password, fullName) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: fullName });
  await ensureUserDoc(result.user, { fullName, provider: 'password' });
  return result.user;
}

export async function signInWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserDoc(result.user, { provider: 'password' });
  return result.user;
}

export async function logout() {
  return signOut(auth);
}

// ================================================================
// ATTEMPTS (Test Results)
// ================================================================
export async function recordAttempt(user, subjectId, subjectName, score, total) {
  const percentage = total > 0 ? (score / total) * 100 : 0;
  await addDoc(collection(db, 'attempts'), {
    uid: user.uid,
    displayName: user.displayName || user.email?.split('@')[0] || 'مجهول',
    photoURL: user.photoURL || null,
    subjectId,
    subjectName,
    score,
    total,
    percentage,
    completedAt: serverTimestamp(),
  });
}

// ================================================================
// REAL-TIME SUBSCRIPTIONS
// ================================================================
export function subscribeLeaderboard(callback) {
  const q = query(
    collection(db, 'attempts'),
    orderBy('completedAt', 'desc'),
    limit(500)
  );
  return onSnapshot(q, (snap) => {
    const attempts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    // Compute best per-user
    const byUser = {};
    for (const a of attempts) {
      if (!byUser[a.uid] || byUser[a.uid].percentage < a.percentage) {
        byUser[a.uid] = a;
      }
    }
    const top = Object.values(byUser)
      .sort((a, b) => b.percentage - a.percentage || b.score - a.score)
      .slice(0, 10);
    callback(top);
  });
}

export function subscribeRecentActivity(callback) {
  const q = query(
    collection(db, 'attempts'),
    orderBy('completedAt', 'desc'),
    limit(15)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function subscribeMemberCount(callback) {
  const usersRef = collection(db, 'users');
  return onSnapshot(usersRef, (snap) => {
    callback(snap.size);
  });
}

export function subscribeRecentMembers(callback) {
  const q = query(collection(db, 'users'), orderBy('joinedAt', 'desc'), limit(8));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function getUserAttempts(uid) {
  const q = query(collection(db, 'attempts'), where('uid', '==', uid), orderBy('completedAt', 'desc'), limit(20));
  return new Promise((resolve) => {
    const unsub = onSnapshot(q, (snap) => {
      resolve(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      unsub();
    });
  });
}
