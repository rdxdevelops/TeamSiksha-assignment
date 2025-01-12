let events = [];

async function getData() {
  const data = await fetch("data.json");
  const dataSet = await data.json();
  events = dataSet;
  console.log(dataSet);
  const container = document.getElementById("events");
  container.innerHTML = dataSet.map(
    (event) => `<div><h3>${event.title}</h3>
    <p>${event.description}</p></div>`
  );
}

function fileteredEvents() {
  const inputValue = document.getElementById("search").value.toLowerCase();
  let fileteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(inputValue)
  );
  console.log(fileteredEvents);
  const container = document.getElementById("events");
  container.innerHTML = fileteredEvents
    .map(
      (event) => `<div><h3>${event.title}</h3>
    <p>${event.description}</p></div>`
    )
    .join("");
}

document.getElementById("search").addEventListener("input", () => {
  fileteredEvents();
});

document.addEventListener("DOMContentLoaded", () => {
  getData();
});
