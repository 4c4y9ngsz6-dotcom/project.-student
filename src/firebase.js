// ================================================================
// 🌟 SIMULATED FIREBASE INTEGRATION (BYPASS & MOCK)
// تم تعديل هذا ملف لمحاكاة قاعدة بيانات ومصادقة Firebase محلياً.
// يسمح هذا للطلاب بتسجيل الدخول والبدء مباشرة دون الحاجة لمفاتيح API.
// ================================================================

// ================================================================
// 🔧 CONFIG & INITIALIZATION (Mocked)
// ================================================================
export const auth = {
  currentUser: null
};

export const db = {};

// Helper to generate Firebase-like Timestamp
const createTimestamp = (date = new Date()) => {
  return {
    toDate: () => date,
    toMillis: () => date.getTime(),
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: (date.getTime() % 1000) * 1e6
  };
};

export const serverTimestamp = () => createTimestamp();

// ================================================================
// 📚 REALISTIC SEED DATA (تم إفراغها بناءً على طلبك لبدء منصة نظيفة)
// ================================================================
const SEED_USERS = [];
const SEED_ATTEMPTS = [];

// ================================================================
// 💾 LOCAL STORAGE DATABASE ADAPTER
// ================================================================
const getMockData = () => {
  let users = [];
  let attempts = [];

  try {
    const uStr = localStorage.getItem('mock_db_users');
    if (uStr) {
      users = JSON.parse(uStr).map(u => ({
        ...u,
        joinedAt: createTimestamp(new Date(u.joinedAtMs))
      }));
      // تنظيف تلقائي للمتصفح من الأسماء التجريبية القديمة إن وجدت
      if (users.some(u => u.uid && u.uid.startsWith('student_'))) {
        users = [];
        saveMockUsers(users);
      }
    } else {
      users = [];
      saveMockUsers(users);
    }
  } catch (e) {
    users = [];
  }

  try {
    const aStr = localStorage.getItem('mock_db_attempts');
    if (aStr) {
      attempts = JSON.parse(aStr).map(a => ({
        ...a,
        completedAt: createTimestamp(new Date(a.completedAtMs))
      }));
      // تنظيف تلقائي للمتصفح من المحاولات التجريبية القديمة
      if (attempts.some(a => a.uid && a.uid.startsWith('student_'))) {
        attempts = [];
        saveMockAttempts(attempts);
      }
    } else {
      attempts = [];
      saveMockAttempts(attempts);
    }
  } catch (e) {
    attempts = [];
  }

  return { users, attempts };
};

const saveMockUsers = (users) => {
  const serialized = users.map(u => ({
    ...u,
    joinedAtMs: u.joinedAt.toMillis()
  }));
  localStorage.setItem('mock_db_users', JSON.stringify(serialized));
};

const saveMockAttempts = (attempts) => {
  const serialized = attempts.map(a => ({
    ...a,
    completedAtMs: a.completedAt.toMillis()
  }));
  localStorage.setItem('mock_db_attempts', JSON.stringify(serialized));
};

// ================================================================
// 📡 REAL-TIME SUBSCRIPTION REGISTRY
// ================================================================
const listeners = {
  memberCount: [],
  recentMembers: [],
  recentActivity: [],
  leaderboard: []
};

const notify = (collection) => {
  const data = getMockData();
  if (collection === 'users') {
    listeners.memberCount.forEach(cb => cb(data.users.length));
    
    const sortedMembers = [...data.users].sort((a, b) => b.joinedAt.toMillis() - a.joinedAt.toMillis());
    listeners.recentMembers.forEach(cb => cb(sortedMembers));
  } else if (collection === 'attempts') {
    const sortedActivity = [...data.attempts].sort((a, b) => b.completedAt.toMillis() - a.completedAt.toMillis());
    listeners.recentActivity.forEach(cb => cb(sortedActivity));

    // Compute best score per user for Leaderboard
    const byUser = {};
    for (const a of data.attempts) {
      if (!byUser[a.uid] || byUser[a.uid].percentage < a.percentage) {
        byUser[a.uid] = a;
      }
    }
    const top = Object.values(byUser)
      .sort((a, b) => b.percentage - a.percentage || b.score - a.score)
      .slice(0, 10);
    
    listeners.leaderboard.forEach(cb => cb(top));
  }
};

// ================================================================
// 🔐 AUTHENTICATION SIMULATOR
// ================================================================
const authListeners = [];

// Restore saved session from LocalStorage if it exists
try {
  const savedUser = localStorage.getItem('mock_current_user');
  if (savedUser) {
    auth.currentUser = JSON.parse(savedUser);
  }
} catch (e) {
  console.error("Failed to restore session", e);
}

export function onAuthStateChanged(authInstance, callback) {
  authListeners.push(callback);
  // Immediately call back with current user status
  callback(auth.currentUser);
  return () => {
    const idx = authListeners.indexOf(callback);
    if (idx !== -1) authListeners.splice(idx, 1);
  };
}

const triggerAuthStateChange = (user) => {
  auth.currentUser = user;
  if (user) {
    localStorage.setItem('mock_current_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('mock_current_user');
  }
  authListeners.forEach(cb => cb(user));
};

export async function signInWithGoogle() {
  const email = prompt("الرجاء إدخال البريد الإلكتروني لحساب Google الخاص بك لتسجيل الدخول الحقيقي وحفظ درجاتك:");
  if (!email || !email.trim()) {
    throw { code: 'auth/popup-closed-by-user', message: 'تم إغلاق نافذة التسجيل' };
  }
  const cleanEmail = email.trim().toLowerCase();
  const data = getMockData();
  let exists = data.users.find(u => u.email === cleanEmail);
  
  let fullName = "";
  if (!exists) {
    fullName = prompt("هذا الحساب يدخل للمرة الأولى، الرجاء إدخال اسمك الثلاثي للتسجيل وحفظ درجاتك:");
    if (!fullName || !fullName.trim()) {
      fullName = cleanEmail.split('@')[0];
    }
    const newUser = {
      uid: 'google_' + Math.random().toString(36).substr(2, 9),
      fullName: fullName.trim(),
      email: cleanEmail,
      photoURL: null,
      joinedAt: createTimestamp(),
      totalAttempts: 0
    };
    data.users.push(newUser);
    saveMockUsers(data.users);
    notify('users');
    exists = newUser;
  }
  
  const mockUser = {
    uid: exists.uid,
    displayName: exists.fullName,
    email: exists.email,
    photoURL: exists.photoURL || null,
    providerData: [{ providerId: 'google.com' }]
  };
  
  triggerAuthStateChange(mockUser);
  return mockUser;
}

export async function signInWithGithub() {
  const email = prompt("الرجاء إدخال البريد الإلكتروني لحساب GitHub الخاص بك لتسجيل الدخول وحفظ درجاتك:");
  if (!email || !email.trim()) {
    throw { code: 'auth/popup-closed-by-user', message: 'تم إغلاق نافذة التسجيل' };
  }
  const cleanEmail = email.trim().toLowerCase();
  const data = getMockData();
  let exists = data.users.find(u => u.email === cleanEmail);
  
  let fullName = "";
  if (!exists) {
    fullName = prompt("هذا الحساب يدخل للمرة الأولى، الرجاء إدخال اسمك الثلاثي للتسجيل وحفظ درجاتك:");
    if (!fullName || !fullName.trim()) {
      fullName = cleanEmail.split('@')[0];
    }
    const newUser = {
      uid: 'github_' + Math.random().toString(36).substr(2, 9),
      fullName: fullName.trim(),
      email: cleanEmail,
      photoURL: null,
      joinedAt: createTimestamp(),
      totalAttempts: 0
    };
    data.users.push(newUser);
    saveMockUsers(data.users);
    notify('users');
    exists = newUser;
  }
  
  const mockUser = {
    uid: exists.uid,
    displayName: exists.fullName,
    email: exists.email,
    photoURL: exists.photoURL || null,
    providerData: [{ providerId: 'github.com' }]
  };
  
  triggerAuthStateChange(mockUser);
  return mockUser;
}

export async function signUpWithEmail(email, password, fullName) {
  const data = getMockData();
  const cleanEmail = email.trim().toLowerCase();
  const exists = data.users.find(u => u.email === cleanEmail);
  if (exists) {
    throw { code: 'auth/email-already-in-use', message: 'Email already exists.' };
  }
  
  const mockUser = {
    uid: 'email_' + Math.random().toString(36).substr(2, 9),
    displayName: fullName.trim(),
    email: cleanEmail,
    photoURL: null,
    providerData: [{ providerId: 'password' }]
  };
  
  data.users.push({
    uid: mockUser.uid,
    fullName: fullName.trim(),
    email: cleanEmail,
    password: password,
    photoURL: null,
    joinedAt: createTimestamp(),
    totalAttempts: 0
  });
  saveMockUsers(data.users);
  notify('users');
  
  triggerAuthStateChange(mockUser);
  return mockUser;
}

export async function signInWithEmail(email, password) {
  const data = getMockData();
  const cleanEmail = email.trim().toLowerCase();
  const exists = data.users.find(u => u.email === cleanEmail);
  
  if (!exists) {
    throw { code: 'auth/user-not-found', message: 'لا يوجد حساب بهذا البريد' };
  }
  
  if (exists.password && exists.password !== password) {
    throw { code: 'auth/wrong-password', message: 'كلمة المرور غير صحيحة' };
  }
  
  const mockUser = {
    uid: exists.uid,
    displayName: exists.fullName,
    email: exists.email,
    photoURL: exists.photoURL || null,
    providerData: [{ providerId: 'password' }]
  };
  
  triggerAuthStateChange(mockUser);
  return mockUser;
}

export async function logout() {
  triggerAuthStateChange(null);
  return true;
}

// ================================================================
// 📝 ATTEMPTS RECORDING
// ================================================================
export async function recordAttempt(user, subjectId, subjectName, score, total) {
  const percentage = total > 0 ? (score / total) * 100 : 0;
  const data = getMockData();
  
  const newAttempt = {
    id: 'attempt_' + Math.random().toString(36).substr(2, 9),
    uid: user.uid,
    displayName: user.displayName || user.email?.split('@')[0] || 'مجهول',
    photoURL: user.photoURL || null,
    subjectId,
    subjectName,
    score,
    total,
    percentage,
    completedAt: createTimestamp()
  };
  
  data.attempts.push(newAttempt);
  saveMockAttempts(data.attempts);
  
  // Also update totalAttempts for the user
  const userIdx = data.users.findIndex(u => u.uid === user.uid);
  if (userIdx !== -1) {
    data.users[userIdx].totalAttempts = (data.users[userIdx].totalAttempts || 0) + 1;
    saveMockUsers(data.users);
  }
  
  // Notify listeners
  notify('attempts');
  notify('users');
  
  return newAttempt;
}

// ================================================================
// 📡 REAL-TIME SUBSCRIPTION METHODS
// ================================================================
export function subscribeLeaderboard(callback) {
  listeners.leaderboard.push(callback);
  
  const data = getMockData();
  const byUser = {};
  for (const a of data.attempts) {
    if (!byUser[a.uid] || byUser[a.uid].percentage < a.percentage) {
      byUser[a.uid] = a;
    }
  }
  const top = Object.values(byUser)
    .sort((a, b) => b.percentage - a.percentage || b.score - a.score)
    .slice(0, 10);
    
  callback(top);
  return () => {
    listeners.leaderboard = listeners.leaderboard.filter(cb => cb !== callback);
  };
}

export function subscribeRecentActivity(callback) {
  listeners.recentActivity.push(callback);
  
  const data = getMockData();
  const sortedActivity = [...data.attempts].sort((a, b) => b.completedAt.toMillis() - a.completedAt.toMillis());
  callback(sortedActivity);
  
  return () => {
    listeners.recentActivity = listeners.recentActivity.filter(cb => cb !== callback);
  };
}

export function subscribeMemberCount(callback) {
  listeners.memberCount.push(callback);
  
  const data = getMockData();
  callback(data.users.length);
  
  return () => {
    listeners.memberCount = listeners.memberCount.filter(cb => cb !== callback);
  };
}

export function subscribeRecentMembers(callback) {
  listeners.recentMembers.push(callback);
  
  const data = getMockData();
  const sortedMembers = [...data.users].sort((a, b) => b.joinedAt.toMillis() - a.joinedAt.toMillis());
  callback(sortedMembers);
  
  return () => {
    listeners.recentMembers = listeners.recentMembers.filter(cb => cb !== callback);
  };
}

export async function getUserAttempts(uid) {
  const data = getMockData();
  const userAttempts = data.attempts
    .filter(a => a.uid === uid)
    .sort((a, b) => b.completedAt.toMillis() - a.completedAt.toMillis())
    .slice(0, 20);
  return userAttempts;
}
