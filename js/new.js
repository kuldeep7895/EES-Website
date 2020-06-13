let params = new URL(document.location).searchParams;
let id = params.get("id");
db.collection("events")
  .doc(id)
  .get()
  .then(function(doc) {
    if (doc.exists) {
      var item = doc.data();
      document
        .getElementById("captioned-gallery")
        .appendChild(check(item.album));
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  })
  .catch(function(error) {
    console.log("Error getting document:", error);
  });

function check(album) {
  // var url = items[0].image.toString();
  var url =
    "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";
  console.log(album);
  var el = `
    <div
    id="carouselExampleControls"
    class="carousel slide"
    data-ride="carousel"
  >
    <div class="carousel-inner">
    `;

  el += `
      <div class="carousel-item active">
      <a href="https://www.google.com/">
        <img
        class="d-block w-100"
        src=${album[0]}
        alt="First slide"
        />
      </a>
    </div>
      `;

  el += `
      <div class="carousel-item">
      <a href="https://www.google.com/">
        <img
        class="d-block w-100"
        src=${album[1]}
        alt="First slide"
        />
      </a>
    </div>
      `;

  el += `
    <a
    class="carousel-control-prev"
    href="#carouselExampleControls"
    role="button"
    data-slide="prev"
  >
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a
    class="carousel-control-next"
    href="#carouselExampleControls"
    role="button"
    data-slide="next"
  >
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
  </div>
    `;

  var div = document.createElement("div");
  div.innerHTML = el.trim();
  return div.firstChild;
}
