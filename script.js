const USERS_PER_PAGE = 4;
const CACHE_KEY = "faciit_users_cache";
const CACHE_TTL = 5 * 60 * 1000;

let allUsers = [];
let filteredUsers = [];
let currentPage = 1;

const grid = document.getElementById("user-grid");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const errorMessage = document.getElementById("error-message");
const retryBtn = document.getElementById("retry-btn");
const searchInput = document.getElementById("search-input");
const pagination = document.getElementById("pagination");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageInfo = document.getElementById("page-info");
const modalOverlay = document.getElementById("modal-overlay");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");

function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getCachedUsers() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return cached.data;
  } catch {
    return null;
  }
}

function setCachedUsers(users) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data: users, timestamp: Date.now() })
    );
  } catch {
    // storage full or unavailable
  }
}

async function fetchUsers() {
  showLoading();

  const cached = getCachedUsers();
  if (cached) {
    allUsers = cached;
    filteredUsers = cached;
    showUsers();
    return;
  }

  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const data = await res.json();
    allUsers = data;
    filteredUsers = data;
    setCachedUsers(data);
    showUsers();
  } catch (err) {
    showError(err.message || "Failed to fetch users. Please try again.");
  }
}

function showLoading() {
  loading.classList.remove("hidden");
  error.classList.add("hidden");
  grid.classList.add("hidden");
  pagination.classList.add("hidden");
}

function showError(msg) {
  loading.classList.add("hidden");
  error.classList.remove("hidden");
  grid.classList.add("hidden");
  pagination.classList.add("hidden");
  errorMessage.textContent = msg;
}

function showUsers() {
  loading.classList.add("hidden");
  error.classList.add("hidden");
  grid.classList.remove("hidden");

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  if (currentPage > totalPages) currentPage = totalPages || 1;

  const start = (currentPage - 1) * USERS_PER_PAGE;
  const pageUsers = filteredUsers.slice(start, start + USERS_PER_PAGE);

  if (filteredUsers.length === 0) {
    grid.innerHTML = '<div class="no-results">No users found.</div>';
    pagination.classList.add("hidden");
    return;
  }

  grid.innerHTML = pageUsers
    .map(
      (user) => `
    <div class="user-card" data-id="${user.id}">
      <div class="avatar">${getInitials(user.name)}</div>
      <h3>${user.name}</h3>
      <p class="email">${user.email.toLowerCase()}</p>
      <p class="company">${user.company.name}</p>
    </div>
  `
    )
    .join("");

  grid.querySelectorAll(".user-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = Number(card.dataset.id);
      openModal(allUsers.find((u) => u.id === id));
    });
  });

  if (totalPages > 1) {
    pagination.classList.remove("hidden");
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  } else {
    pagination.classList.add("hidden");
  }
}

function openModal(user) {
  if (!user) return;
  modalContent.innerHTML = `
    <div class="modal-header">
      <div class="avatar">${getInitials(user.name)}</div>
      <div>
        <h2>${user.name}</h2>
        <p>@${user.username}</p>
      </div>
    </div>
    <div class="detail-section">
      <h4>Contact</h4>
      <p>${user.email.toLowerCase()}</p>
      <p>${user.phone}</p>
      <p><a href="https://${user.website}" target="_blank" rel="noopener">${user.website}</a></p>
    </div>
    <div class="detail-section">
      <h4>Address</h4>
      <p>${user.address.street}, ${user.address.suite}<br/>
      ${user.address.city}, ${user.address.zipcode}</p>
    </div>
    <div class="detail-section">
      <h4>Company</h4>
      <p><strong>${user.company.name}</strong></p>
      <p>${user.company.catchPhrase}</p>
      <p><em>${user.company.bs}</em></p>
    </div>
  `;
  modalOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.classList.add("hidden");
  document.body.style.overflow = "";
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  filteredUsers = query
    ? allUsers.filter((u) => u.name.toLowerCase().includes(query))
    : allUsers;
  currentPage = 1;
  showUsers();
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    showUsers();
  }
});

nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  if (currentPage < totalPages) {
    currentPage++;
    showUsers();
  }
});

retryBtn.addEventListener("click", () => {
  localStorage.removeItem(CACHE_KEY);
  fetchUsers();
});

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

fetchUsers();
