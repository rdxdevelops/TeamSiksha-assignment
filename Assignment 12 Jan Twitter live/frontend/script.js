let events = [];
let filteredEvents = []; //array to keep track of filtered results
let currentPage = 1;
const recordsPerPage = 10;

async function loadEvents() {
  try {
    const response = await fetch("data.json");
    events = await response.json();
    filteredEvents = [...events];
    sortEvents(document.getElementById("sortOrder").value);
    updateUI();
  } catch (error) {
    console.error("failed to load the events", error);
  }
}

function sortEvents(order) {
  const eventsToSort = filteredEvents.length > 0 ? filteredEvents : events;
  eventsToSort.sort((a, b) => {
    const timeA = new Date(a.startTime).getTime();
    const timeB = new Date(b.startTime).getTime();
    return order === "asc" ? timeA - timeB : timeB - timeA;
  });
}

function displayEvents(events) {
  const eventList = document.getElementById("eventList");
  eventList.innerHTML = "";

  if (events.length === 0) {
    eventList.innerHTML = "<li class='event-item'>No events found</li>";
    return;
  }

  events.forEach((event) => {
    const listItem = document.createElement("li");
    listItem.classList.add("event-item");
    listItem.innerHTML = `
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <p><strong>Start Time:</strong> ${new Date(
              event.startTime
            ).toLocaleString()}</p>
            <p><strong>End Time:</strong> ${new Date(
              event.endTime
            ).toLocaleString()}</p>
        `;
    eventList.appendChild(listItem);
  });
}

function paginateEvents() {
  const start = (currentPage - 1) * recordsPerPage;
  const end = start + recordsPerPage;
  return filteredEvents.length > 0
    ? filteredEvents.slice(start, end)
    : events.slice(start, end);
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  const totalEvents =
    filteredEvents.length > 0 ? filteredEvents.length : events.length;
  const totalPages = Math.ceil(totalEvents / recordsPerPage);

  const prevButton = document.createElement("button");
  prevButton.textContent = "Prev";
  prevButton.disabled = currentPage === 1;
  prevButton.classList.toggle("disabled", currentPage === 1);
  prevButton.addEventListener("click", () => {
    currentPage--;
    updateUI();
  });

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.disabled = currentPage === totalPages;
  nextButton.classList.toggle("disabled", currentPage === totalPages);
  nextButton.addEventListener("click", () => {
    currentPage++;
    updateUI();
  });

  pagination.appendChild(prevButton);
  pagination.appendChild(nextButton);
}

function updateUI() {
  displayEvents(paginateEvents());
  renderPagination();
}

//search functionality
const handleSearch = () => {
  const searchInput = document.getElementById("search");
  const searchTerm = searchInput.value.toLowerCase();
  filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm) ||
      event.description.toLowerCase().includes(searchTerm)
  );
  currentPage = 1;
  sortEvents(document.getElementById("sortOrder").value);
  updateUI();
};

document
  .querySelector(".search-bar button")
  .addEventListener("click", handleSearch);

document.getElementById("sortOrder").addEventListener("change", (e) => {
  sortEvents(e.target.value);
  updateUI();
});

loadEvents();
