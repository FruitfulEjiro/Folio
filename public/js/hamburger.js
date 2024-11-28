"use script";

let flag = true;

export function hamburger() {
  const navigation = document.querySelector(".navigation");

  if (flag) {
    navigation.style.transform = "translateY(0%)";
    navigation.style.visibility = "visible";
  } else {
    navigation.style.transform = "translateY(30%)";
    navigation.style.visibility = "collapse";
  }
  flag = !flag;
}

export function dashboardHamburger() {
  const sidebar = document.querySelector(".sidebar");

  if (flag) {
    sidebar.style.transform = "translateX(0%)";
  } else {
    sidebar.style.transform = "translateX(-100%)";
  }
  flag = !flag;
}
