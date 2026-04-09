import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyBIEK8aQCgBmkcCNOhhTuz-KFR3nC4AKsw",
  authDomain: "scravieqer.firebaseapp.com",
  projectId: "scravieqer"
};

const app = initializeApp(firebaseConfig);

// 🔥 ここは1回だけ
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);  // ← これを追加
const provider = new GoogleAuthProvider();

const provider = new GoogleAuthProvider();

// ログイン
window.login = () => {
  signInWithRedirect(auth, provider);
};

// リダイレクト後
getRedirectResult(auth)
  .then((result) => {
    if (result) {
      console.log("ログイン成功:", result.user);
      alert("ログイン成功！");
    }
  })
  .catch((e) => {
    console.error(e);
    alert(e.code + "\n" + e.message);
  });

// 状態監視
onAuthStateChanged(auth, (user) => {
  console.log("ここ通ってる？"); // 👈追加

  const status = document.getElementById("status");

  if (!status) {
    console.error("statusが見つからない");
    return;
  }

  if (user) {
    status.textContent = "ログイン中: " + user.displayName;
  } else {
    status.textContent = "未ログイン";
  }
});
