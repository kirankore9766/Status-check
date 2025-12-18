function renderProfile(name) {
  document.getElementById("profile").innerHTML =
    "<h1>" + name + "</h1>";
}

const nameFromUrl = location.search.split("=")[1];
renderProfile(nameFromUrl);
