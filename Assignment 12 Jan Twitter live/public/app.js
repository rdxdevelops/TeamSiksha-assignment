class EventsManager {
    constructor() {
        this.events = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.init();
        this.editDialog = document.getElementById('editDialog');
        this.deleteDialog = document.getElementById('deleteDialog');
        this.currentEditSlug = null;
        this.currentDeleteSlug = null;
        this.lastError = null;
        this.searchDebounceTimer = null;
        this.isLoading = false;
    }

    showError(message, retryFunction) {
        const errorHtml = `
            <div class="error-message">
                <span>${message}</span>
                <div>
                    ${retryFunction ? '<button class="retry-btn">Retry</button>' : ''}
                    <button class="refresh-btn">Refresh Page</button>
                </div>
            </div>
        `;
        const container = document.querySelector('.container');
        const existingError = container.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        container.insertAdjacentHTML('afterbegin', errorHtml);

        if (retryFunction) {
            container.querySelector('.retry-btn').addEventListener('click', async () => {
                container.querySelector('.error-message').remove();
                await retryFunction();
            });
        }

        container.querySelector('.refresh-btn').addEventListener('click', () => {
            window.location.reload();
        });
    }

    async init() {
        try {
            await this.fetchEvents();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error loading events:', error);
        }
    }

    async fetchEvents() {
        this.setLoading(true);
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        try {
            const response = await fetch(`/api/events${searchTerm ? `?query=${searchTerm}` : ''}`);
            if (!response.ok) throw new Error('Failed to fetch events');
            this.events = await response.json();
            this.renderEvents();
        } catch (error) {
            this.showError('Failed to load events. Please try again.', () => this.fetchEvents());
            console.error('Error fetching events:', error);
        } finally {
            this.setLoading(false);
        }
    }

    async deleteEvent(slug) {
        try {
            const response = await fetch(`/api/events/${slug}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete event');
            await this.fetchEvents(); // Refresh the list
        } catch (error) {
            this.showError('Failed to delete event. Please try again.', () => this.deleteEvent(slug));
            console.error('Error deleting event:', error);
        }
    }

    async updateEventDescription(slug, description) {
        try {
            const response = await fetch(`/api/events/${slug}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description }),
            });
            if (!response.ok) throw new Error('Failed to update event');
            await this.fetchEvents(); // Refresh the list
            this.editDialog.close();
        } catch (error) {
            this.showError('Failed to update event. Please try again.', 
                () => this.updateEventDescription(slug, description));
            console.error('Error updating event:', error);
        }
    }

    setupEventListeners() {
        // Debounced search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            clearTimeout(this.searchDebounceTimer);
            this.searchDebounceTimer = setTimeout(() => {
                this.currentPage = 1;
                this.fetchEvents();
            }, 300);
        });

        document.getElementById('sortSelect').addEventListener('change', () => {
            this.currentPage = 1;
            this.renderEvents();
        });

        document.getElementById('prevPage').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderEvents();
            }
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            const maxPages = Math.ceil(this.getFilteredEvents().length / this.itemsPerPage);
            if (this.currentPage < maxPages) {
                this.currentPage++;
                this.renderEvents();
            }
        });

        document.getElementById('eventsList').addEventListener('click', async (e) => {
            const eventCard = e.target.closest('.event-card');
            if (!eventCard) return;

            if (e.target.classList.contains('delete-btn')) {
                this.currentDeleteSlug = eventCard.dataset.slug;
                this.deleteDialog.showModal();
            }

            if (e.target.classList.contains('edit-btn')) {
                this.currentEditSlug = eventCard.dataset.slug;
                document.getElementById('editDescription').value = eventCard.dataset.description;
                this.editDialog.showModal();
            }
        });

        // Edit dialog listeners
        document.getElementById('cancelButton').addEventListener('click', () => {
            this.editDialog.close();
        });

        this.editDialog.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newDescription = document.getElementById('editDescription').value;
            if (newDescription && this.currentEditSlug) {
                await this.updateEventDescription(this.currentEditSlug, newDescription);
            }
        });

        // Delete dialog listeners
        document.getElementById('cancelDelete').addEventListener('click', () => {
            this.deleteDialog.close();
        });

        this.deleteDialog.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (this.currentDeleteSlug) {
                await this.deleteEvent(this.currentDeleteSlug);
                this.deleteDialog.close();
            }
        });

        // Keyboard navigation for dialogs
        this.editDialog.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.editDialog.close();
        });

        this.deleteDialog.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.deleteDialog.close();
        });
    }

    getFilteredEvents() {
        const sortDirection = document.getElementById('sortSelect').value;
        
        return [...this.events].sort((a, b) => {
            const dateA = new Date(a.created);
            const dateB = new Date(b.created);
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }

    renderEvents() {
        const filtered = this.getFilteredEvents();
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const paginatedEvents = filtered.slice(start, end);

        const eventsHtml = paginatedEvents.map(event => `
            <div class="event-card" data-slug="${event.slug}" data-description="${event.description}">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <div class="event-meta">
                    <div class="event-time">
                        <span class="visually-hidden">Start time:</span>
                        <svg aria-hidden="true" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 3.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zM8 2a6 6 0 100 12A6 6 0 008 2z"/>
                            <path d="M8 4.5a.5.5 0 01.5.5v3.5H11a.5.5 0 010 1H8a.5.5 0 01-.5-.5V5a.5.5 0 01.5-.5z"/>
                        </svg>
                        ${this.formatDate(event.startTime)}
                    </div>
                    <div class="event-time">
                        <span class="visually-hidden">End time:</span>
                        <svg aria-hidden="true" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 3.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zM8 2a6 6 0 100 12A6 6 0 008 2z"/>
                            <path d="M4 8a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7A.5.5 0 014 8z"/>
                        </svg>
                        ${this.formatDate(event.endTime)}
                    </div>
                </div>
                <div class="event-actions">
                    <button class="edit-btn" aria-label="Edit event">Edit</button>
                    <button class="delete-btn" aria-label="Delete event">Delete</button>
                </div>
            </div>
        `).join('');

        document.getElementById('eventsList').innerHTML = eventsHtml;
        document.getElementById('pageInfo').textContent = 
            `Page ${this.currentPage} of ${Math.ceil(filtered.length / this.itemsPerPage)}`;
    }

    setLoading(loading) {
        this.isLoading = loading;
        const eventsList = document.getElementById('eventsList');
        eventsList.classList.toggle('loading', loading);
    }

    formatDate(dateString) {
        const options = { 
            weekday: 'short',
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleString(undefined, options);
    }
}

new EventsManager();
