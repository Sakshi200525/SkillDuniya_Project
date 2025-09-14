const API_URL = "https://jsonplaceholder.typicode.com/users";
const form = document.getElementById("crud-form");
const userList = document.getElementById("user-list");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const userIdInput = document.getElementById("userId");

// Custom names + emails
const customNames = ["sakshi", "sagar", "tanika"];
const customEmails = [
  "sakshi@gmail.com",
  "sagranvre34@gmail.com",
  "tanika123@gmail.com"
];

// Keep local users for updates
let localUsers = [];

// ----------- READ (Fetch users) -----------
async function loadUsers() {
  userList.innerHTML = "<p>Loading...</p>";
  try {
    const res = await fetch(API_URL);
    const users = await res.json();

    // Replace API names & emails with custom ones
    localUsers = users.slice(0, customNames.length).map((user, i) => ({
      ...user,
      name: customNames[i],
      email: customEmails[i]
    }));

    renderUsers();
  } catch (error) {
    userList.innerHTML = "<p>Error loading users.</p>";
  }
}

// ----------- RENDER USERS -----------
function renderUsers() {
  userList.innerHTML = "";
  localUsers.forEach((user) => {
    const div = document.createElement("div");
    div.classList.add("user-card");
    div.innerHTML = `
      <span><b>${user.name}</b> (${user.email})</span>
      <div>
        <button class="edit" onclick="editUser(${user.id})">Edit</button>
        <button class="delete" onclick="deleteUser(${user.id})">Delete</button>
      </div>
    `;
    userList.appendChild(div);
  });
}

// ----------- CREATE & UPDATE -----------
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = userIdInput.value;
  const userData = {
    id: id ? parseInt(id) : Date.now(), // New ID if creating
    name: nameInput.value,
    email: emailInput.value
  };

  if (id) {
    // UPDATE local array
    localUsers = localUsers.map((u) =>
      u.id === parseInt(id) ? userData : u
    );
    alert("User updated!");
  } else {
    // CREATE new user
    localUsers.push(userData);
    alert("User added!");
  }

  form.reset();
  userIdInput.value = "";
  renderUsers();
});

// ----------- Fill form for Update -----------
function editUser(id) {
  const user = localUsers.find((u) => u.id === id);
  if (user) {
    userIdInput.value = user.id;
    nameInput.value = user.name;
    emailInput.value = user.email;
  }
}

// ----------- DELETE -----------
function deleteUser(id) {
  if (confirm("Are you sure you want to delete this user?")) {
    localUsers = localUsers.filter((u) => u.id !== id);
    alert("User deleted!");
    renderUsers();
  }
}

// Initial load
loadUsers();
