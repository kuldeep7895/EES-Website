var db = firebase.firestore();

// function check(items) {
//   var url = items[0].image.toString();
//   console.log(url);
//   var el = `
//   <div
//   id="carouselExampleControls"
//   class="carousel slide"
//   data-ride="carousel"
// >
//   <div class="carousel-inner">
//   `;

//   el += `
//     <div class="carousel-item active">
//     <a href="https://www.google.com/">
//       <img
//       class="d-block w-100"
//       src=${url}
//       alt="First slide"
//       />
//     </a>
//   </div>
//     `;

//   el += `
//     <div class="carousel-item">
//     <a href="https://www.google.com/">
//       <img
//       class="d-block w-100"
//       src=${url}
//       alt="First slide"
//       />
//     </a>
//   </div>
//     `;

//   el += `
//   <a
//   class="carousel-control-prev"
//   href="#carouselExampleControls"
//   role="button"
//   data-slide="prev"
// >
//   <span class="carousel-control-prev-icon" aria-hidden="true"></span>
//   <span class="sr-only">Previous</span>
// </a>
// <a
//   class="carousel-control-next"
//   href="#carouselExampleControls"
//   role="button"
//   data-slide="next"
// >
//   <span class="carousel-control-next-icon" aria-hidden="true"></span>
//   <span class="sr-only">Next</span>
// </a>
// </div>
//   `;

//   var div = document.createElement("div");
//   div.innerHTML = el.trim();
//   return div.firstChild;
// }

function checkFinalItems(item, id) {
  console.log(item);
  console.log(id);
  var url = "events/event1.html?id=" + String(id);
  var el = `
  <div
    class="card"
    style="width: 18rem;display: inline-block;margin: 20px"
  >
  <img
    src=${item.image}
    class="card-img-top"
    alt="..."
  />
  <div class="card-body">
    <h5 class="card-title">${item.name}</h5>
    <a href=${url} class="btn btn-primary">Go To Album</a>
  </div>
  </div>
  `;
  var div = document.createElement("div");
  div.innerHTML = el.trim();
  return div.firstChild;
}
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
