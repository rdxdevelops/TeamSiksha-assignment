let events = [];
let currentPage = 1;
const eventsPerPage = 10;
let sortDirection = "desc";

async function getData() {
  const data = await fetch("data.json");
  events = await data.json();
  reenderedEvents();
  console.log(events);
  const container = document.getElementById("events");
  container.innerHTML = events.map(
    (event) => `<div><h3>${event.title}</h3>
    <p>${event.description}</p></div>`
  );
}

function reenderedEvents() {
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

  fileteredEvents.sort((a, b) => {
    const dateA = new Date(a.startTime);
    const dateB = new Date(b.startTime);
    return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
  });
  //   console.log(sorted);
}

document.getElementById("search").addEventListener("input", () => {
  fileteredEvents();
});
document.getElementById("sortButton").addEventListener("click", () => {
  sortDirection = sortDirection === "asc" ? "desc" : "asc";
  document.getElementById("sortButton").textContent = `Sort by Date ${
    sortDirection === "asc" ? "up" : "downn"
  }`;
  reenderedEvents();
});

document.addEventListener("DOMContentLoaded", () => {
  getData();
});
