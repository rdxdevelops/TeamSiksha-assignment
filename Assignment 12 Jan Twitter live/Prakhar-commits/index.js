let events = [];

async function getData() {
  const data = await fetch("data.json");
  const dataSet = await data.json();
  console.log(dataSet);

  const container = document.getElementById("events");
  container.innerHTML = dataSet
    .map(
      (event) => `<div><h3>${event.title}</h3><p>${event.description}</p></div>`
    )
    .join("");
}
document.addEventListener("DOMContentLoaded", () => {
  getData();
});

function getInputValue() {
  const inputValue = document.getElementById("search").value.toLowerCase();
  return inputValue;
}
