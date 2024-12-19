const eventForm = document.getElementById('event-form');
const eventList = document.getElementById('event-list');

// Fetch and display events from the server
async function fetchEvents() {
    try {
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('Failed to fetch events');
        const events = await response.json();

        // Clear and populate the event list
        eventList.innerHTML = '';
        if (events.length === 0) {
            eventList.innerHTML = '<p>No upcoming events found.</p>';
        } else {
            events.forEach(event => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <h3>${event.title}</h3>
                    <p>${event.description}</p>
                    <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()} <strong>Time:</strong> ${event.time}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                    <p><strong>Organizer:</strong> ${event.organizer}</p>
                `;
                eventList.appendChild(li);
            });
        }
    } catch (error) {
        console.error('Error fetching events:', error);
        eventList.innerHTML = '<p>Error loading events. Please try again later.</p>';
    }
}

// Handle form submission to create a new event
eventForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(eventForm);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Failed to create event');

        // Reset the form and refresh the event list
        eventForm.reset();
        fetchEvents();
        alert('Event created successfully!');
    } catch (error) {
        console.error('Error creating event:', error);
        alert('Failed to create event. Please try again.');
    }
});

// Load events on page load
fetchEvents();
