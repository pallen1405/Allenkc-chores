const users = {
  "Emma": "1234",
  "Liam": "5678"
};

let currentUser = null;

function login() {
  const name = document.getElementById("child-name").value;
  const pin = document.getElementById("child-pin").value;

  if (users[name] && users[name] === pin) {
    currentUser = name;
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("app-screen").classList.remove("hidden");
    document.getElementById("welcome-msg").textContent = `Welcome, ${name}`;
    renderChores();
  } else {
    alert("Invalid name or PIN");
  }
}

function logout() {
  currentUser = null;
  document.getElementById("login-screen").classList.remove("hidden");
  document.getElementById("app-screen").classList.add("hidden");
}

function getChores() {
  return JSON.parse(localStorage.getItem(`chores_${currentUser}`)) || [];
}

function saveChores(chores) {
  localStorage.setItem(`chores_${currentUser}`, JSON.stringify(chores));
}

function renderChores() {
  const list = document.getElementById("chore-list");
  list.innerHTML = "";
  const chores = getChores();
  let earned = 0;
  let paid = 0;

  chores.forEach((chore, index) => {
    const div = document.createElement("div");
    div.className = "chore";

    const checked = chore.done ? "checked" : "";
    const payClass = chore.paid ? "paid" : "";

    div.innerHTML = `
      <input type="checkbox" onchange="toggleDone(${index})" ${checked}> 
      <span class="${payClass}">${chore.name} ($${chore.rate})</span>
      <button onclick="markPaid(${index})">Mark Paid</button>
      <button onclick="deleteChore(${index})">❌</button>
    `;

    if (chore.done) earned += Number(chore.rate);
    if (chore.paid) paid += Number(chore.rate);

    list.appendChild(div);
  });

  document.getElementById("summary").innerHTML = `
    <p>Total Earned: $${earned.toFixed(2)}</p>
    <p>Total Paid: $${paid.toFixed(2)}</p>
  `;
}

function addChore() {
  const name = document.getElementById("new-chore-name").value;
  const rate = parseFloat(document.getElementById("new-chore-rate").value);

  if (!name || isNaN(rate)) {
    alert("Enter valid chore name and rate.");
    return;
  }

  const chores = getChores();
  chores.push({ name, rate, done: false, paid: false });
  saveChores(chores);
  renderChores();

  document.getElementById("new-chore-name").value = '';
  document.getElementById("new-chore-rate").value = '';
}

function toggleDone(index) {
  const chores = getChores();
  chores[index].done = !chores[index].done;
  saveChores(chores);
  renderChores();
}

function markPaid(index) {
  const chores = getChores();
  if (chores[index].done) {
    chores[index].paid = true;
    saveChores(chores);
    renderChores();
  } else {
    alert("Chore must be marked done first!");
  }
}

function deleteChore(index) {
  const chores = getChores();
  chores.splice(index, 1);
  saveChores(chores);
  renderChores();
}
