import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
 apiKey: "AIzaSyBIEK8aQCgBmkcCNOhhTuz-KFR3nC4AKsw",
  authDomain: "scravieqer.firebaseapp.com",
  databaseURL: "https://scravieqer-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "scravieqer",
  storageBucket: "scravieqer.firebasestorage.app",
  messagingSenderId: "815845461056",
  appId: "1:815845461056:web:eef5f338d745f08db5a3a5",
  measurementId: "G-LGE6B6KP46"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let user = null;
let worksData = [];

onAuthStateChanged(auth, (u) => {
  user = u;
});

// ログイン
window.login = async () => {
  await signInWithPopup(auth, provider);
};

// BANチェック
async function isBanned(uid) {
  const snap = await getDoc(doc(db, "bannedUsers", uid));
  return snap.exists();
}

// reCAPTCHA
async function getToken() {
  return await grecaptcha.execute("6LfLyKIsAAAAAFqX_PFaeCZtIBDZ3p-IRJ_tBtjp", { action: "like" });
}

// データ取得
fetch("https://opensheet.elk.sh/1PZWVVDAFLz4HCfMr7CW8AKY4wykW0yWMNe-4eUvyiWY/Sheet1")
  .then(res => res.json())
  .then(data => {
    worksData = data.map(d => ({
      id: d["URL"].match(/\d+/)[0],
      title: d["作品タイトル"],
      url: `https://turbowarp.org/${d["URL"].match(/\d+/)[0]}/embed`,
      desc: d["説明"],
      tag: d["タグ"],
      time: d["タイムスタンプ"]
    }));
    display();
  });

async function display() {
  const container = document.getElementById("works");
  container.innerHTML = "";

  let list = [];

  for (let w of worksData) {
    const snap = await getDoc(doc(db, "likes", w.id));
    const likes = snap.exists() ? snap.data().count : 0;
    list.push({ ...w, likes });
  }

  list.sort((a, b) => b.likes - a.likes);

  for (let w of list) {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${w.title}</h3>
      <iframe src="${w.url}"></iframe>
      <p>${w.desc}</p>
      <button onclick="like('${w.id}')">❤️ ${w.likes}</button>
    `;

    container.appendChild(div);
  }
}

// いいね
window.like = async (id) => {
  if (!user) return alert("ログインして");

  if (await isBanned(user.uid)) {
    return alert("BANされています");
  }

  const token = await getToken();

  const ref = doc(db, "likes", id);
  try {
    await updateDoc(ref, { count: increment(1) });
  } catch {
    await setDoc(ref, { count: 1 });
  }

  await setDoc(doc(db, "userLikes", user.uid + "_" + id), {
    token
  });

  display();
};
