import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDI334sOziCBt5PCEZFcl3KhTBQMrnN1R8",
  authDomain: "pd23-demo.firebaseapp.com",
  projectId: "pd23-demo",
  storageBucket: "pd23-demo.appspot.com",
  messagingSenderId: "428041542235",
  appId: "1:428041542235:web:5e203bac0792af8a29fd7e",
  measurementId: "G-9TGHMD2RZ1"
};


// initialize firebase app
const app = initializeApp(firebaseConfig);

// initialize services
const db = getFirestore(app);
const auth = getAuth(app);

// db.settings({ timeStampsInSnapshots: true });

export { auth, db };
export default app;
