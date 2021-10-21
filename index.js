import sketch1 from "./sketch1.js";
import sketch2 from "./sketch2.js";
import sketch3 from "./sketch3.js";
import sketch4 from "./sketch4.js";

window.onload = function () {
  new p5(sketch1, "#c1");
  new p5(sketch2, "#c2");
  sketch3(document.getElementById("c3"));
  const s4 = sketch4(document.getElementById("c4"));
  document.getElementById("c4-new").addEventListener("click", () => {
    s4();
  });
};
