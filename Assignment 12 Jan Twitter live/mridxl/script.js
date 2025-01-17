// get a reference to various elements
const eventList = document.getElementById('eventList'); // container for event cards
const searchInput = document.getElementById('searchInput');
const pagination = document.getElementById('pagination');
const sortButton = document.getElementById('sortBy');

let allEvents = []; //global variable to store all events
let currentPage = 1; // current page number tracker
const EVENTS_PER_PAGE = 10;

// fetch data from data.json
async function getEvents() {
	try {
		const response = await fetch('data.json');
		if (!response.ok) {
			throw new Error('Error fetching data');
		}
		allEvents = await response.json();
		renderEvents();
		renderPagination();
	} catch (error) {
		eventList.innerHTML = `<p>Error fetching data</p>`;
	}
}

// render events
function renderEvents() {
	const query = searchInput.value.toLowerCase();
	const filteredEvents = query
		? allEvents.filter((event) => event.title.toLowerCase().includes(query))
		: allEvents;

	// sort events by start time if sortBy is set
	const sortedEvents = sortEvents(filteredEvents);

	// pagination
	const start = (currentPage - 1) * EVENTS_PER_PAGE;
	const end = start + EVENTS_PER_PAGE;

	// currentEvents is an array of events to be displayed on the current page
	const currentEvents = sortedEvents.slice(start, end);

	eventList.innerHTML = ''; // Clear previous events

	if (currentEvents.length === 0) {
		eventList.innerHTML = `<p>No events found.</p>`;
		return;
	}

	currentEvents.forEach((event) => {
		const eventCard = document.createElement('div');
		eventCard.classList.add('event');
		eventCard.innerHTML = `
            <h3>${event.title}</h3>
            <p><b>Description:</b> ${event.description}</p>
            <p><b>Created:</b> ${new Date(event.created).toLocaleString(
							'en-GB'
						)}</p>
            <p><b>Start Time:</b> ${new Date(event.startTime).toLocaleString(
							'en-GB'
						)}</p>
            <p><b>End Time:</b> ${new Date(event.endTime).toLocaleString(
							'en-GB'
						)}</p>
        `;
		eventList.appendChild(eventCard);
	});
}

function sortEvents(events) {
	const sortByValue = sortButton.value;

	return [...events].sort((a, b) => {
		const aTime = new Date(a.startTime).getTime();
		const bTime = new Date(b.startTime).getTime();

		if (sortByValue === 'asc') {
			return aTime - bTime;
		} else {
			return bTime - aTime;
		}
	});
}

function renderPagination() {
	const filteredEvents = searchInput.value
		? allEvents.filter((event) =>
				event.title.toLowerCase().includes(searchInput.value.toLowerCase())
		  )
		: allEvents;
	const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);
	pagination.innerHTML = '';

	for (let i = 1; i <= totalPages; i++) {
		const pageButton = document.createElement('button');
		pageButton.textContent = i;
		pageButton.addEventListener('click', () => {
			currentPage = i;
			renderEvents();
			updateActiveButton();
		});
		pagination.appendChild(pageButton);
	}
	updateActiveButton();
}

function updateActiveButton() {
	const buttons = pagination.querySelectorAll('button');
	buttons.forEach((button, index) => {
		if (index + 1 === currentPage) {
			button.classList.add('active');
		} else {
			button.classList.remove('active');
		}
	});
}

searchInput.addEventListener('input', () => {
	currentPage = 1;
	renderEvents();
	renderPagination();
});

sortButton.addEventListener('change', () => {
	renderEvents();
});

getEvents();
