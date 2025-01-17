let allEvents = []; // To store the fetched data
let currentPage = 1; // Current page for pagination
const recordsPerPage = 10; // Records per page

// Fetch the event data
fetch('./data.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    allEvents = data; // Store fetched data in allEvents
    displayPaginatedEvents(); // Display paginated data
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
    alert('Failed to load event data. Check the console for more details.');
  });

// Function to display events
function displayPaginatedEvents() {
  const eventContainer = document.getElementById('event-container');
  eventContainer.innerHTML = ''; // Clear container

  // Paginate events
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedEvents = allEvents.slice(startIndex, startIndex + recordsPerPage);

  // Display each event
  paginatedEvents.forEach((event) => {
    const eventCard = document.createElement('div');
    eventCard.className = 'event-card';
    eventCard.innerHTML = `
      <h3>${event.title}</h3>
      <p><strong>Description:</strong> ${event.description}</p>
      <p><strong>Created:</strong> ${new Date(event.created).toLocaleString()}</p>
      <p><strong>Start Time:</strong> ${new Date(event.startTime).toLocaleString()}</p>
      <p><strong>End Time:</strong> ${new Date(event.endTime).toLocaleString()}</p>
    `;
    eventContainer.appendChild(eventCard);
  });

  updatePaginationControls();
}

// Search functionality
document.getElementById('search-input').addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  allEvents = allEvents.filter((event) => event.title.toLowerCase().includes(searchTerm));
  currentPage = 1; // Reset to first page
  displayPaginatedEvents();
});

// Sorting functionality
document.getElementById('sort-select').addEventListener('change', (e) => {
  const sortOrder = e.target.value;
  allEvents.sort((a, b) => {
    const dateA = new Date(a.created).getTime();
    const dateB = new Date(b.created).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });
  displayPaginatedEvents();
});

// Pagination controls
function updatePaginationControls() {
  const paginationContainer = document.getElementById('pagination-controls');
  paginationContainer.innerHTML = ''; // Clear pagination controls
  const totalPages = Math.ceil(allEvents.length / recordsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.className = i === currentPage ? 'active' : '';
    pageButton.addEventListener('click', () => {
      currentPage = i;
      displayPaginatedEvents();
    });
    paginationContainer.appendChild(pageButton);
  }
}
