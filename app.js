const users = {
  "Izzy Allen": { pin: "1234", role: "child" },
  "Charlie Allen": { pin: "5678", role: "child" },
  "Judah Allen": { pin: "9012", role: "child" },
  "Parent": { pin: "0000", role: "parent" }
};

let currentUser = null;
let currentRole = null;

function login() {
  const name = document.getElementById("user-name").value;
  const pin = document.getElementById("user-pin").value;

  if (!name) {
    alert("Please select a user");
    return;
  }
  
  if (!pin) {
    alert("Please enter a PIN");
    return;
  }

  if (users[name] && users[name].pin === pin) {
    currentUser = name;
    currentRole = users[name].role;
    document.getElementById("login-screen").classList.add("hidden");
    
    if (currentRole === "parent") {
      document.getElementById("parent-screen").classList.remove("hidden");
      loadParentDashboard();
    } else {
      document.getElementById("child-screen").classList.remove("hidden");
      document.getElementById("welcome-msg").textContent = `Welcome, ${name}`;
      renderChores();
    }
  } else {
    alert("Invalid name or PIN");
  }
}

function logout() {
  currentUser = null;
  currentRole = null;
  document.getElementById("login-screen").classList.remove("hidden");
  document.getElementById("child-screen").classList.add("hidden");
  document.getElementById("parent-screen").classList.add("hidden");
}

function getChildrenChores() {
  const allChores = {};
  
  Object.keys(users).forEach(user => {
    if (users[user].role === "child") {
      allChores[user] = JSON.parse(localStorage.getItem(`chores_${user}`)) || [];
    }
  });
  
  return allChores;
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

// Parent functions
function loadParentDashboard() {
  renderParentDashboard();
}

function renderParentDashboard() {
  const childrenChores = getChildrenChores();
  const dashboardDiv = document.getElementById("parent-dashboard");
  dashboardDiv.innerHTML = "";
  
  // Create a section for each child
  Object.keys(childrenChores).forEach(child => {
    const childSection = document.createElement("div");
    childSection.className = "child-section";
    
    const childHeader = document.createElement("h3");
    childHeader.textContent = child;
    childSection.appendChild(childHeader);
    
    // Create a list of chores for this child
    const choresList = document.createElement("div");
    choresList.className = "child-chores";
    
    childrenChores[child].forEach((chore, index) => {
      const choreItem = document.createElement("div");
      choreItem.className = "chore";
      
      const status = chore.done ? (chore.paid ? "Paid" : "Done") : "Not Done";
      const statusClass = chore.done ? (chore.paid ? "paid" : "done") : "";
      
      choreItem.innerHTML = `
        <span class="${statusClass}">${chore.name} ($${chore.rate})</span>
        <span class="status">${status}</span>
      `;
      
      choresList.appendChild(choreItem);
    });
    
    childSection.appendChild(choresList);
    dashboardDiv.appendChild(childSection);
  });
}

function assignChore() {
  const childName = document.getElementById("assign-child").value;
  const choreName = document.getElementById("assign-chore-name").value;
  const choreRate = parseFloat(document.getElementById("assign-chore-rate").value);
  
  if (!childName || !choreName || isNaN(choreRate)) {
    alert("Please enter valid child name, chore name, and rate.");
    return;
  }
  
  if (!users[childName] || users[childName].role !== "child") {
    alert("Please select a valid child.");
    return;
  }
  
  const childChores = JSON.parse(localStorage.getItem(`chores_${childName}`)) || [];
  childChores.push({
    name: choreName,
    rate: choreRate,
    done: false,
    paid: false
  });
  
  localStorage.setItem(`chores_${childName}`, JSON.stringify(childChores));
  
  // Clear the form
  document.getElementById("assign-chore-name").value = "";
  document.getElementById("assign-chore-rate").value = "";
  
  // Refresh the dashboard
  renderParentDashboard();
}
