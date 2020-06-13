var db = firebase.firestore();

async function getMarker() {
  const snapshot = await db.collection("events").get();
  return snapshot.docs.map(doc => ({
    data: doc.data(),
    id: doc.id
  }));
}
async function hello() {
  const items = await getMarker();
  // console.log(items);
  // console.log(items);
  items.forEach(item => {
    document
      .getElementById("insertHere")
      .appendChild(checkFinalItems(item.data, item.id));
  });
}
hello();
