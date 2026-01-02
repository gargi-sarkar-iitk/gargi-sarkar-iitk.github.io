const items = document.querySelectorAll(".ticker p");
let index = 0;

setInterval(() => {
  items.forEach(p => p.style.display = "none");
  items[index].style.display = "block";
  index = (index + 1) % items.length;
}, 3000);
