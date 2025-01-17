let events = [];
const pageSize = 5;
let currentPage = 1;

document.addEventListener("DOMContentLoaded", () => {
  fetch("./data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch event data");
      }
      return response.json();
    })
    .then((data) => {
      events = data;
      renderData();
      searchEvents();
    })
    .catch((error) => console.error("Error fetching data:", error));
});

// render events 
function renderData() {
  const eventList = document.getElementById("event-list");
  const pagination = document.getElementById("pagination");
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

  const filteredEvents = getFilteredEvents();
  const paginatedEvents = filteredEvents.slice(start, end);

  // event cards
  eventList.innerHTML = paginatedEvents
    .map(
      (event) => `
      <div class="event-card">
        <h2>${event.title}</h2>
        <p>${event.description}</p>
      </div>
    `
    )
    .join("");

  // pagination buttons
  const totalPages = Math.ceil(filteredEvents.length / pageSize);
  pagination.innerHTML = `
    <button ${currentPage === 1 ? "class='disabled'" : ""
    } onclick="changePage(-1)">Previous</button>
    <span>Page ${currentPage} of ${totalPages}</span>
    <button ${currentPage === totalPages ? "class='disabled'" : ""
    } onclick="changePage(1)">Next</button>
  `;
}

// filter by search query
function getFilteredEvents() {
  const query = document.getElementById("search").value.toLowerCase();

  let filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(query)
  );

  return filteredEvents;
}

// Change pagination
function changePage(direction) {
  const filteredEvents = getFilteredEvents();
  const totalPages = Math.ceil(filteredEvents.length / pageSize);

  currentPage = Math.max(1, Math.min(currentPage + direction, totalPages));
  renderData();
}

// Set up search
function searchEvents() {
  const searchInput = document.getElementById("search");

  searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderData();
  });
}
