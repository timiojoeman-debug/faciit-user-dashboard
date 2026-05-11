# User Dashboard

A simple, responsive user dashboard that fetches and displays user data from the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/users).

## Features
- Fetches user data from a API (using fetch())
- Displays user name, email, and company in a card layout
- Search filters users by name in real time
- Click a user card to view full details (contact, address, website)
- Loading and error handling is present with retry
- Pagination (4 users per page)
- Local storage caching
- Fully responsive design

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/faciit-user-dashboard.git
   cd faciit-user-dashboard
   ```

2. Open `index.html` in your browser:
   - Double-click the file, **or**
   - Use a local server:
     ```bash
     npx serve .
     ```

No build tools or dependencies required.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)

## Project Structure

```
faciit-user-dashboard/
├── index.html    # Main HTML page
├── styles.css    # Styles and responsive layout
├── script.js     # Application logic (fetch, search, pagination, modal)
└── README.md     # This file
```
