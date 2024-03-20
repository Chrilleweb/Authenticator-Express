document.addEventListener("DOMContentLoaded", function () {
  const loaderBar = document.getElementById("loader-bar");
  loaderBar.style.width = "0";

  setTimeout(() => {
    loaderBar.style.width = "100%";
    setTimeout(() => {
      loaderBar.style.display = "none";
    }, 500);
  }, 0);
});
