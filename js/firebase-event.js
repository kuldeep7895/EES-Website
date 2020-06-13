var db = firebase.firestore();

//! Firestore Configuration
var storage = firebase.storage();
var storageRef = storage.ref();
var homepageRef = storageRef.child("homepage");

let params = new URL(document.location).searchParams;
let id = params.get("id");
db.collection("events")
  .doc(id)
  .get()
  .then(function(doc) {
    if (doc.exists) {
      var item = doc.data();
      let p = document.getElementById("desp");
      p.innerText = item.description;
      let f = document.getElementById("dynamicForm");
      f.innerHTML = item.formHTML;
      var backg = item.poster;
      let pp = document.getElementById("fuckThisShit");
      pp.insertAdjacentElement("afterbegin", anotherOne(backg));
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

  for (var i = 1; i < album.length; i++) {
    el += `
    <div class="carousel-item">
    <a href="https://www.google.com/">
      <img
      class="d-block w-100"
      src=${album[i]}
      alt="First slide"
      />
    </a>
  </div>
    `;
  }

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

function anotherOne(u) {
  var el = `		<section class="banner_area col-lg-6" style="background-image: url(${u}) ;float:left;min-height:1000px;">
  <div class="banner_inner d-flex align-items-center">
    <div class="overlay bg-parallax" data-stellar-ratio="0.9" data-stellar-vertical-offset="0" data-background=""></div>
    <div class="container">
      <div class="banner_content text-center">
        <div class="page_link">
          <a href="../index.html">Home</a>
          <a href="../gallery.html">Gallery</a>
        </div>
          <h2>Event Gallery</h2>
        </div>
      </div>
    </div>
  </section>`;
  var div = document.createElement("div");
  div.innerHTML = el.trim();
  return div.firstChild;
}
