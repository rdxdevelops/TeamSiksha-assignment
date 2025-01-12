
let data = [];

fetch('data.json')
  .then(response => response.json())
  .then(fetchedData => {
    data = fetchedData; 
    renderCards(data); 
  });

function renderCards(items) {
  const container = document.getElementById('tiles-container');
  container.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    
    card.innerHTML = `
      <h5 class="card-title">${item.title}</h5>
      <h6 class="card-subtitle">${item.slug}</h6>
      <p class="card-text">${item.description}</p>
      <div class="info-row">
        <strong>Created:</strong>
        <span>${new Date(item.created).toLocaleString()}</span>
      </div>
      <div class="info-row">
        <strong>Start Time:</strong>
        <span>${new Date(item.startTime).toLocaleString()}</span>
      </div>
      <div class="info-row">
        <strong>End Time:</strong>
        <span>${new Date(item.endTime).toLocaleString()}</span>
      </div>
    `;
    
    container.appendChild(card);
  });
}

function filterCards() {
  const query = document.getElementById('searchBar').value.toLowerCase();
  const filteredData = data.filter(item => 
    item.title.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query)
  );
  renderCards(filteredData); 
}