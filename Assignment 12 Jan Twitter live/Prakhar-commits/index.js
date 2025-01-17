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

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString();
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

  const start = (currentPage - 1) * eventsPerPage;
  const paginatedEvents = fileteredEvents.slice(start, start + eventsPerPage);

  const eventsContainer = document.getElementById("eventsList");
  eventsContainer.innerHTML = paginatedEvents
    .map(
      (event) => `
      <div class="event-card">
          <h2 class="event-title">${event.title}</h2>
          <p class="event-description">${event.description}</p>
          <div class="event-time">
              <p>Created: ${formatDateTime(event.created)}</p>
              <p>Starts: ${formatDateTime(event.startTime)}</p>
              <p>Ends: ${formatDateTime(event.endTime)}</p>
          </div>
      </div>
  `
    )
    .join("");

  renderPagination(fileteredEvents.length);
}

function renderPagination(totalEvents) {
  const totalPages = Math.ceil(totalEvents / eventsPerPage);
  const paginationContainer = document.getElementById("pagination");

  let paginationHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
            <button class="page-button ${currentPage === i ? "active" : ""}"
                    onclick="changePage(${i})">${i}</button>
        `;
  }

  paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
  currentPage = page;
  reenderedEvents();
}

document.getElementById("search").addEventListener("input", () => {
  reenderedEvents();
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
