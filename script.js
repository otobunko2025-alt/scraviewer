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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// =====================
// ログインボタン
// =====================
window.login = () => {
  signInWithRedirect(auth, provider);
};
// =====================
// リダイレクト後の処理
// =====================
getRedirectResult(auth)
  .then((result) => {
    if (result) {
      console.log("ログイン成功:", result.user);
      alert("ログイン成功！");
    }
  })
  .catch((e) => {
    console.error("ログインエラー:", e);
    alert(e.code + "\n" + e.message);
  });

// =====================
// ログイン状態監視
// =====================
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("ログイン中:", user.uid);
  } else {
    console.log("未ログイン");
  }
});
