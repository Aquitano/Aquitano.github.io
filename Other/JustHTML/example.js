var slider;
var delay = (function () {
  var timer = 0;
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();
function printSlideIndex() {
  document.querySelector(".js-index").innerHTML = this.currentSlide + 1;
  slider = this.currentSlide;
  let classes = [
    "Fade-in",
    "Fly-in-left",
    "Fly-in-right",
    "Fly-in-up",
    "Fly-in-down",
    "Zoom-in",
    "Entrance-left",
    "Entrance-right",
    "Entrance-up",
    "Entrance-down",
  ];
  if (slider != 9) {
    var element = document.getElementById("D" + slider);
    element.classList.remove(classes[slider]);
    element.classList.add("invisible");
    delay(function () {
      element.classList.add(classes[slider]);
      element.classList.remove("invisible");
    }, 600);
  } else {
    var x = document.querySelectorAll("#D9");
    x[1].classList.remove(classes[slider]);
    x[1].classList.add("invisible");
    delay(function () {
      x[1].classList.add(classes[slider]);
      x[0].classList.add(classes[slider]);
      x[1].classList.remove("invisible");
    }, 600);
  }
}
function replayA() {
  if (slider != 9) {
    var element = document.getElementById("D" + slider);
    var gotclass = element.classList.item(0);
    element.classList.remove(gotclass);
    delay(function () {
      element.classList.add(gotclass);
    }, 100);
  } else {
    var x = document.querySelectorAll("#D9");
    var gotclass = x[1].classList.item(0);
    x[1].classList.remove(gotclass);
    delay(function () {
      x[1].classList.add(gotclass);
    }, 100);
  }
}
function copy(x) {
  document.getElementById("Text" + x).select();
  document.execCommand("copy");
  document.getElementById("A" + x).classList.add("success");
}
const mySiema = new Siema({
  duration: 200,
  loop: true,
  onInit: printSlideIndex,
  onChange: printSlideIndex,
});
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const replay = document.querySelector(".replay");
const copy1 = document.querySelector(".copy1");
const copy2 = document.querySelector(".copy2");
const copy3 = document.querySelector(".copy3");
const copy4 = document.querySelector(".copy4");
prev.addEventListener("click", () => mySiema.prev());
next.addEventListener("click", () => mySiema.next());
replay.addEventListener("click", () => this.replayA());
copy1.addEventListener("click", () => this.copy(1));
copy2.addEventListener("click", () => this.copy(2));
copy3.addEventListener("click", () => this.copy(3));
copy4.addEventListener("click", () => this.copy(4));