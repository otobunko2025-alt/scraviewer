 await setDoc(doc(db, "bannedUsers", uid), {
    banned: true
  });

  alert("BANしました");
  loadBanList();
};

// BAN一覧
async function loadBanList() {
  const list = document.getElementById("banList");
  list.innerHTML = "";

  const snapshot = await getDocs(collection(db, "bannedUsers"));

  snapshot.forEach(docSnap => {
    const div = document.createElement("div");
    div.textContent = docSnap.id;
    list.appendChild(div);
  });
}
