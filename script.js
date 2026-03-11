const container = document.getElementById("street-lines");

for (let i = 0; i < 7; i++) {
  const rect = document.createElement("div");
  rect.classList.add("street-rectangle");
  container.appendChild(rect);
}