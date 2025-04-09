// Config/FirebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// (nếu cần) import thêm các service khác, ví dụ Storage:
// import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCdRluFaVDQSLvdOGEHkn_Nx1kL2YcSxWY",
  authDomain: "chatapp-e5c71.firebaseapp.com",
  projectId: "chatapp-e5c71",
  storageBucket: "chatapp-e5c71.firebasestorage.app",
  messagingSenderId: "671237788706",
  appId: "1:671237788706:web:4d398a3d663f3557c4e67b",
  measurementId: "G-FTNL9LLP4P"
};

// Khởi tạo app
const app = initializeApp(firebaseConfig);

// Export các instance
const auth = getAuth(app);
const firestore = getFirestore(app);
export { auth, firestore, FacebookAuthProvider, signInWithCredential };