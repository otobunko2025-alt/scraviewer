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

// 🔥 Firebase設定（自分のに変更）
const firebaseConfig = {
  apiKey: "ここ",
  authDomain: "ここ",
  projectId: "ここ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let user = null;
let worksData = [];

// ログイン状態
onAuthStateChanged(auth, (u) => {
  user = u;
  document.getElementById("loginBtn").textContent =
    user ? "ログイン済み" : "Googleでログイン";
});

// ログイン
window.login = async function() {
  await signInWithPopup(auth, provider);
};

// 🔗 スプレッドシートJSON
const API_URL = "https://opensheet.elk.sh/1PZWVVDAFLz4HCfMr7CW8AKY4wykW0yWMNe-4eUvyiWY/Sheet1";
// データ取得
fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    worksData = data.map(item => ({
      id: extractId(item["URL"]),
      title: item["作品タイトル"],
      url: convertToEmbed(item["URL"]),
      description: item["説明"],
      tag: item["タグ"]
    }));

    displayWorks();
  });

// ID抽出
function extractId(url) {
  const match = url.match(/(\d+)/);
  return match ? match[1] : null;
}

// embed変換
function convertToEmbed(url) {
  const match = url.match(/(\d+)/);
  return match ? `https://turbowarp.org/${match[1]}/embed` : "";
}

// 表示
async function displayWorks() {
  const container = document.getElementById("works");
  container.innerHTML = "";

  const search = document.getElementById("search").value.toLowerCase();
  const tag = document.getElementById("tagFilter").value;

  for (let work of worksData) {
    if (!work.url) continue;

    if (!work.title.toLowerCase().includes(search)) continue;
    if (tag && work.tag !== tag) continue;

    // いいね取得
    const likeRef = doc(db, "likes", work.id);
    const likeSnap = await getDoc(likeRef);
    const likes = likeSnap.exists() ? likeSnap.data().count : 0;

    // ユーザーいいね確認
    let liked = false;
    if (user) {
      const userLikeRef = doc(db, "userLikes", user.uid + "_" + work.id);
      const snap = await getDoc(userLikeRef);
      liked = snap.exists();
    }

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${work.title}</h3>
      <iframe src="${work.url}" allowfullscreen></iframe>
      <p>${work.description}</p>
      <div class="tag">${work.tag}</div>
      <button onclick="like('${work.id}')" ${liked ? "disabled" : ""}>
        ❤️ ${likes}
      </button>
    `;

    container.appendChild(div);
  }
}

// いいね処理（1人1回）
window.like = async function(id) {
  if (!user) {
    alert("ログインしてください");
    return;
  }

  const likeRef = doc(db, "likes", id);
  const userLikeRef = doc(db, "userLikes", user.uid + "_" + id);

  const snap = await getDoc(userLikeRef);
  if (snap.exists()) {
    alert("すでにいいね済み");
    return;
  }

  try {
    await updateDoc(likeRef, {
      count: increment(1)
    });
  } catch {
    await setDoc(likeRef, { count: 1 });
  }

  await setDoc(userLikeRef, { liked: true });

  displayWorks();
};

// イベント
document.getElementById("search").addEventListener("input", displayWorks);
document.getElementById("tagFilter").addEventListener("change", displayWorks);
