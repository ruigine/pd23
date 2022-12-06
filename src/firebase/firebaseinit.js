import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_4lrd9Z34mYf6azqlJQYyR-vmQnguzDk",
  authDomain: "pd23-voucher-website.firebaseapp.com",
  projectId: "pd23-voucher-website",
  storageBucket: "pd23-voucher-website.appspot.com",
  messagingSenderId: "407141157212",
  appId: "1:407141157212:web:8e5be5c2776d6dcdea5999",
};


// initialize firebase app
const app = initializeApp(firebaseConfig);

// initialize services
const db = getFirestore(app);
const auth = getAuth(app);

// db.settings({ timeStampsInSnapshots: true });

export { auth, db };
export default app;
