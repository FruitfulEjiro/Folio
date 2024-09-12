"use strict";

const hamburger = document.querySelector(".hamburger-icon");
const navigation = document.querySelector(".navigation-items");

let flag = true;

hamburger.addEventListener("click", e => {
  if (flag) {
    navigation.style.transform = "translateY(0%)";
    navigation.style.visibility = "visible";
  } else {
    navigation.style.transform = "translateY(30%)";
    navigation.style.visibility = "collapse";
  }
  flag = !flag;
});

