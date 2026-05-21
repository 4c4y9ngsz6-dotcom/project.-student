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
// 📚 REALISTIC SEED DATA (بيانات تجريبية واقعية)
// ================================================================
const SEED_USERS = [
  { uid: 'student_1', fullName: 'أحمد محمود العلي', email: 'ahmed.ali@student.com', joinedAtMs: Date.now() - 3600000 * 24 * 5, totalAttempts: 4 },
  { uid: 'student_2', fullName: 'فاطمة الزهراء حسن', email: 'fatima.h@student.com', joinedAtMs: Date.now() - 3600000 * 24 * 4, totalAttempts: 5 },
  { uid: 'student_3', fullName: 'مصطفى حسين الخفاجي', email: 'mustafa.k@student.com', joinedAtMs: Date.now() - 3600000 * 24 * 3, totalAttempts: 3 },
  { uid: 'student_4', fullName: 'زينب جعفر السعدي', email: 'zeinab.s@student.com', joinedAtMs: Date.now() - 3600000 * 24 * 2, totalAttempts: 2 },
  { uid: 'student_5', fullName: 'علي جاسم معاريج', email: 'ali.j@student.com', joinedAtMs: Date.now() - 3600000 * 12, totalAttempts: 6 },
  { uid: 'student_6', fullName: 'مريم عبد الرحمن', email: 'maryam.a@student.com', joinedAtMs: Date.now() - 3600000 * 6, totalAttempts: 2 },
  { uid: 'student_7', fullName: 'حسن ناصر الوائلي', email: 'hassan.w@student.com', joinedAtMs: Date.now() - 3600000 * 2, totalAttempts: 1 }
];

const SEED_ATTEMPTS = [
  {
    id: 'attempt_1',
    uid: 'student_2',
    displayName: 'فاطمة الزهراء حسن',
    photoURL: null,
    subjectId: 'novel',
    subjectName: 'الرواية',
    score: 148,
    total: 150,
    percentage: (148 / 150) * 100,
    completedAtMs: Date.now() - 3600000 * 24 * 3
  },
  {
    id: 'attempt_2',
    uid: 'student_5',
    displayName: 'علي جاسم معاريج',
    photoURL: null,
    subjectId: 'methods',
    subjectName: 'طرائق التدريس',
    score: 28,
    total: 30,
    percentage: (28 / 30) * 100,
    completedAtMs: Date.now() - 3600000 * 18
  },
  {
    id: 'attempt_3',
    uid: 'student_1',
    displayName: 'أحمد محمود العلي',
    photoURL: null,
    subjectId: 'novel',
    subjectName: 'الرواية',
    score: 142,
    total: 150,
    percentage: (142 / 150) * 100,
    completedAtMs: Date.now() - 3600000 * 14
  },
  {
    id: 'attempt_4',
    uid: 'student_3',
    displayName: 'مصطفى حسين الخفاجي',
    photoURL: null,
    subjectId: 'grammar',
    subjectName: 'النحو',
    score: 18,
    total: 20,
    percentage: 90,
    completedAtMs: Date.now() - 3600000 * 8
  },
  {
    id: 'attempt_5',
    uid: 'student_4',
    displayName: 'زينب جعفر السعدي',
    photoURL: null,
    subjectId: 'poetry',
    subjectName: 'الشعر',
    score: 22,
    total: 25,
    percentage: 88,
    completedAtMs: Date.now() - 3600000 * 4
  },
  {
    id: 'attempt_6',
    uid: 'student_6',
    displayName: 'مريم عبد الرحمن',
    photoURL: null,
    subjectId: 'novel',
    subjectName: 'الرواية',
    score: 135,
    total: 150,
    percentage: (135 / 150) * 100,
    completedAtMs: Date.now() - 3600000 * 2
  },
  {
    id: 'attempt_7',
    uid: 'student_7',
    displayName: 'حسن ناصر الوائلي',
    photoURL: null,
    subjectId: 'guidance',
    subjectName: 'الإرشاد التربوي',
    score: 27,
    total: 30,
    percentage: 90,
    completedAtMs: Date.now() - 3600000 * 0.5
  }
];

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
    } else {
      users = SEED_USERS.map(u => ({
        ...u,
        joinedAt: createTimestamp(new Date(u.joinedAtMs))
      }));
      saveMockUsers(users);
    }
  } catch (e) {
    users = SEED_USERS.map(u => ({
      ...u,
      joinedAt: createTimestamp(new Date(u.joinedAtMs))
    }));
  }

  try {
    const aStr = localStorage.getItem('mock_db_attempts');
    if (aStr) {
      attempts = JSON.parse(aStr).map(a => ({
        ...a,
        completedAt: createTimestamp(new Date(a.completedAtMs))
      }));
    } else {
      attempts = SEED_ATTEMPTS.map(a => ({
        ...a,
        completedAt: createTimestamp(new Date(a.completedAtMs))
      }));
      saveMockAttempts(attempts);
    }
  } catch (e) {
    attempts = SEED_ATTEMPTS.map(a => ({
      ...a,
      completedAt: createTimestamp(new Date(a.completedAtMs))
    }));
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
  const mockUser = {
    uid: 'google_' + Math.random().toString(36).substr(2, 9),
    displayName: 'طالب Google تجريبي',
    email: 'student.google@example.com',
    photoURL: null,
    providerData: [{ providerId: 'google.com' }]
  };
  
  const data = getMockData();
  const exists = data.users.find(u => u.email === mockUser.email);
  if (!exists) {
    data.users.push({
      uid: mockUser.uid,
      fullName: mockUser.displayName,
      email: mockUser.email,
      photoURL: mockUser.photoURL,
      joinedAt: createTimestamp(),
      totalAttempts: 0
    });
    saveMockUsers(data.users);
    notify('users');
  } else {
    mockUser.uid = exists.uid;
    mockUser.displayName = exists.fullName;
  }
  
  triggerAuthStateChange(mockUser);
  return mockUser;
}

export async function signInWithGithub() {
  const mockUser = {
    uid: 'github_' + Math.random().toString(36).substr(2, 9),
    displayName: 'طالب GitHub تجريبي',
    email: 'student.github@example.com',
    photoURL: null,
    providerData: [{ providerId: 'github.com' }]
  };
  
  const data = getMockData();
  const exists = data.users.find(u => u.email === mockUser.email);
  if (!exists) {
    data.users.push({
      uid: mockUser.uid,
      fullName: mockUser.displayName,
      email: mockUser.email,
      photoURL: mockUser.photoURL,
      joinedAt: createTimestamp(),
      totalAttempts: 0
    });
    saveMockUsers(data.users);
    notify('users');
  } else {
    mockUser.uid = exists.uid;
    mockUser.displayName = exists.fullName;
  }
  
  triggerAuthStateChange(mockUser);
  return mockUser;
}

export async function signUpWithEmail(email, password, fullName) {
  const data = getMockData();
  const exists = data.users.find(u => u.email === email);
  if (exists) {
    throw { code: 'auth/email-already-in-use', message: 'Email already exists.' };
  }
  
  const mockUser = {
    uid: 'email_' + Math.random().toString(36).substr(2, 9),
    displayName: fullName,
    email: email,
    photoURL: null,
    providerData: [{ providerId: 'password' }]
  };
  
  data.users.push({
    uid: mockUser.uid,
    fullName: fullName,
    email: email,
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
  const exists = data.users.find(u => u.email === email);
  
  // Auto-register if student enters a new email to keep experience frictionless!
  if (!exists) {
    const fullName = email.split('@')[0];
    const mockUser = {
      uid: 'email_' + Math.random().toString(36).substr(2, 9),
      displayName: fullName,
      email: email,
      photoURL: null,
      providerData: [{ providerId: 'password' }]
    };
    
    data.users.push({
      uid: mockUser.uid,
      fullName: fullName,
      email: email,
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
  
  const mockUser = {
    uid: exists.uid,
    displayName: exists.fullName,
    email: exists.email,
    photoURL: exists.photoURL,
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
