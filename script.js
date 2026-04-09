import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "scravieqer.firebaseapp.com",
  projectId: "scravieqer"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ログイン
window.login = () => {
  signInWithRedirect(auth, provider);
};

// 状態確認
onAuthStateChanged(auth, (user) => {
  const status = document.getElementById("status");

  if (user) {
    status.textContent = "ログイン中: " + user.displayName;
  } else {
    status.textContent = "未ログイン";
  }
});
