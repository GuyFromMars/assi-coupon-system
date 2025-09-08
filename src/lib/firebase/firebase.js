import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.MY_DB_CONN_API,
  authDomain: process.env.MY_DB_CONN_AUTH_DOMAIN,
  projectId: process.env.MY_DB_CONN_PROJECT_ID,
  storageBucket: process.env.MY_DB_CONN_STORAGE_BUCKET,
  messagingSenderId: process.env.MY_DB_CONN_MESSAGING_SENDER_ID,
  appId: process.env.MY_DB_CONN_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
