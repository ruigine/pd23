import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
exports.handler = async () => {
  const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
  };
  
  // initialize firebase app
  const app = initializeApp(firebaseConfig);

  return {
    statusCode: 200,
  };
};


// initialize services
const db = getFirestore(app);
const auth = getAuth(app);

// db.settings({ timeStampsInSnapshots: true });

export { auth, db };
export default app;
