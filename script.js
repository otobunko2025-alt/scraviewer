import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBIEK8aQCgBmkcCNOhhTuz-KFR3nC4AKsw",
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

// リダイレクト後
getRedirectResult(auth)
  .then((result) => {
    if (result) {
      alert("ログイン成功");
    }
  })
  .catch((e) => {
    alert(e.code);
  });

// 状態表示
onAuthStateChanged(auth, (user) => {
  const status = document.getElementById("status");

  if (user) {
    status.textContent = "ログイン中: " + user.displayName;
  } else {
    status.textContent = "未ログイン";
  }
});
