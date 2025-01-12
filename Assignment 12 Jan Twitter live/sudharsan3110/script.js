document.addEventListener("DOMContentLoaded", () => {
  let data = [];
  let currentPage = 1;
  const itemsPerPage = 10;
  let isAscending = true;

  const searchInput = document.getElementById("search");
  const dataContainer = document.getElementById("data-container");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const pageInfo = document.getElementById("page-info");
  const sortButton = document.getElementById("sort-btn");

  async function fetchData() {
    const response = await fetch("data.json");
    data = await response.json();
    renderData();
  }

  function renderData() {
    const filteredData = filterData();
    const sortedData = sortData(filteredData);
    const paginatedData = paginateData(sortedData);

    dataContainer.innerHTML = paginatedData
      .map(
        (item) => `
      <div class="card">
        <h2>${item.title}</h2>
        <p>${item.description}</p>
        <p><strong>Created:</strong> ${new Date(item.created).toLocaleString()}</p>
        <p><strong>Start Time:</strong> ${new Date(item.startTime).toLocaleString()}</p>
        <p><strong>End Time:</strong> ${new Date(item.endTime).toLocaleString()}</p>
      </div>
    `
      )
      .join("");

    updatePagination(filteredData.length);
  }

  // Filter data based on search input
  function filterData() {
    const query = searchInput.value.toLowerCase();
    return data.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }

  function sortData(filteredData) {
    return filteredData.sort((a, b) => {
      const aTimestamp = new Date(a.created).getTime();
      const bTimestamp = new Date(b.created).getTime();
      return isAscending ? aTimestamp - bTimestamp : bTimestamp - aTimestamp;
    });
  }

 
  function paginateData(filteredData) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }

 
  function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages || totalPages === 0;

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  }

 
  prevButton.addEventListener("click", () => {
    currentPage--;
    renderData();
  });

  nextButton.addEventListener("click", () => {
    currentPage++;
    renderData();
  });

  searchInput.addEventListener("input", () => {
    currentPage = 1; 
    renderData();
  });
  
  sortButton.addEventListener("click", () => {
    isAscending = !isAscending; 
    sortButton.textContent = isAscending
      ? "Sort by Timestamp (Asc)"
      : "Sort by Timestamp (Desc)";
    renderData();
  });

  
  fetchData();
});
