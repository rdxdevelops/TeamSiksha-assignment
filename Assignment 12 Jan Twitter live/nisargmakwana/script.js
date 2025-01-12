import {eventData} from "./global.js";

let currentPage = 1;
const itemsPerPage = 10;
let currentEvents = [...eventData];
console.log(currentEvents)

function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
}
  
function renderEvents() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedEvents = currentEvents.slice(startIndex, endIndex);
    
    const eventsHTML = paginatedEvents.map(event => `
      <div class="event-card">
        <h2>${event.title}</h2>
        <p class="description">${event.description}</p>
        <div class="event-details">
          <p><strong>Created:</strong> ${formatDate(event.created)}</p>
          <p><strong>Start Time:</strong> ${formatDate(event.startTime)}</p>
          <p><strong>End Time:</strong> ${formatDate(event.endTime)}</p>
        </div>
      </div>
    `).join('');
  
    document.getElementById('events-container').innerHTML = eventsHTML;
    updatePagination();
}
  
function updatePagination() {
    const totalPages = Math.ceil(currentEvents.length / itemsPerPage);
    const paginationHTML = `
      <button onclick="changePage(-1)" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
      <span>Page ${currentPage} of ${totalPages}</span>
      <button onclick="changePage(1)" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
    `;
    document.getElementById('pagination').innerHTML = paginationHTML;
}
  
window.changePage = (delta) => {
    const totalPages = Math.ceil(currentEvents.length / itemsPerPage);
    currentPage = Math.max(1, Math.min(currentPage + delta, totalPages));
    renderEvents();
  };
  
window.searchEvents = (query) => {
    currentEvents = currentEvents.filter(event => 
      event.title.toLowerCase().includes(query.toLowerCase())
    );
    currentPage = 1;
    renderEvents();
  }
  
window.sortEvents = (order) => {
    currentEvents.sort((a, b) => {
      const dateA = new Date(a.created);
      const dateB = new Date(b.created);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
    renderEvents();
}
  
document.querySelector('#app').innerHTML = `
  <div class="controls">
    <div class="search-box">
      <input 
        type="text" 
        id="search" 
        placeholder="Search events..."
        oninput="searchEvents(this.value)"
      >
    </div>
    <div class="sort-controls">
      <button onclick="sortEvents('asc')">Sort Ascending</button>
      <button onclick="sortEvents('desc')">Sort Descending</button>
    </div>
  </div>
  <div id="events-container"></div>
  <div id="pagination" class="pagination"></div>
`;

renderEvents();