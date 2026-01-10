import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC8J_sp4sISSDsX8DgUjzkq8J3EstlxyJc",
  authDomain: "smart-task-date-planner.firebaseapp.com",
  projectId: "smart-task-date-planner",
  storageBucket: "smart-task-date-planner.firebasestorage.app",
  messagingSenderId: "82254005292",
  appId: "1:82254005292:web:ea5bcc48d25d991aa1fd89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
