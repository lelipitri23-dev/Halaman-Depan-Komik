import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
// Analytics opsional, kita handle agar tidak error di server side
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Mencegah inisialisasi ganda saat hot-reload Next.js
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

// Analytics hanya jalan di browser (client-side)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export { auth };
