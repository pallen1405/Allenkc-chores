// Debug flag
const DEBUG = true;

// Debug helper function
function debug(message) {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`);
  }
}

// Log when the script loads
debug("App.js script loaded");

// Define users with PINs and roles
const users = {
  "Izzy Allen": { pin: "1234", role: "child" },
  "Charlie Allen": { pin: "5678", role: "child" },
  "Judah Allen": { pin: "9012", role: "child" },
  "Parent": { pin: "0000", role: "parent" }
};

// Load saved users from local storage if available
function loadUsers() {
  const savedUsers = localStorage.getItem('users');
  if (savedUsers) {
    // Merge saved users with default users (for backward compatibility)
    const parsedUsers = JSON.parse(savedUsers);
    Object.keys(parsedUsers).forEach(user => {
      if (users[user]) {
        users[user].pin = parsedUsers[user].pin;
      }
    });
    debug("Loaded users from localStorage");
  }
}

// Save users to local storage
function saveUsers() {
  localStorage.setItem('users', JSON.stringify(users));
  debug("Saved users to localStorage");
}

// Initialize by loading users
loadUsers();

let currentUser = null;
let currentRole = null;

// Simple login function for the login button
function loginSimple() {
  debug("Simple login function triggered");
  
  const name = document.getElementById("user-name").value;
  const pin = document.getElementById("user-pin").value;
  
  debug(`Login attempt with name: ${name}, pin length: ${pin ? pin.length : 0}`);
  
  if (!name) {
    alert("Please select a user");
    return;
  }
  
  if (!pin) {
    alert("Please enter your PIN");
    return;
  }
  
  // Simple test login
  if (users[name] && users[name].pin === pin) {
    debug("Login successful");
    currentUser = name;
    currentRole = users[name].role;
    document.getElementById("login-screen").classList.add("hidden");
    
    if (users[name].role === "parent") {
      document.getElementById("parent-screen").classList.remove("hidden");
      loadParentDashboard();
    } else {
      document.getElementById("child-screen").classList.remove("hidden");
      document.getElementById("welcome-msg").textContent = `Welcome, ${name}!`;
      renderChores();
    }
  } else {
    alert("Invalid username or PIN");
  }
}

// Initialize the application
window.onload = function() {
  debug("Window loaded");
  
  // Check if we need to set up event listeners
  // (We're using inline onclick in HTML, so we don't need these anymore)
  // Just keep this for reference and future enhancements
  
  debug("Application initialized");
};

// Check if there's a saved session
function checkExistingSession() {
  // For future implementation if needed
}

function login() {
  debug("Login function called");
  
  const name = document.getElementById("user-name").value;
  const pin = document.getElementById("user-pin").value;
  
  debug(`Login attempt: User=${name}, PIN length=${pin.length}`);

  if (!name) {
    alert("Please select a user");
    debug("Login failed: No user selected");
    return;
  }
  
  if (!pin) {
    alert("Please enter a PIN");
    debug("Login failed: No PIN entered");
    return;
  }

  if (users[name] && users[name].pin === pin) {
    debug("Login successful");
    currentUser = name;
    currentRole = users[name].role;
    document.getElementById("login-screen").classList.add("hidden");
    
    if (currentRole === "parent") {
      debug("Showing parent screen");
      document.getElementById("parent-screen").classList.remove("hidden");
      loadParentDashboard();
    } else {
      debug("Showing child screen");
      document.getElementById("child-screen").classList.remove("hidden");
      document.getElementById("welcome-msg").textContent = `Welcome, ${name}`;
      renderChores();
    }
  } else {
    alert("Invalid name or PIN");
    debug("Login failed: Invalid credentials");
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
    
    // Create the checkbox container with label
    const checkboxContainer = document.createElement("div");
    checkboxContainer.className = "checkbox-container";
    
    const checkboxLabel = document.createElement("span");
    checkboxLabel.className = "checkbox-label";
    checkboxLabel.textContent = "Done?";
    checkboxContainer.appendChild(checkboxLabel);

    // Create the checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = chore.done;
    checkbox.dataset.index = index;
    checkbox.addEventListener("change", function() {
      toggleDone(parseInt(this.dataset.index));
    });
    checkboxContainer.appendChild(checkbox);

    // Create the chore name span
    const nameSpan = document.createElement("span");
    nameSpan.className = `chore-name ${payClass}`;
    nameSpan.textContent = `${chore.name} ($${chore.rate})`;
    nameSpan.style.flex = "1"; // Take up available space

    // Done timestamp
    const doneTime = document.createElement("span");
    doneTime.className = "done-time";
    if (chore.done && chore.doneAt) {
      doneTime.textContent = `Done: ${new Date(chore.doneAt).toLocaleString()}`;
      doneTime.style.marginLeft = "10px";
      doneTime.style.fontSize = "0.8em";
      doneTime.style.color = "#888";
    }

    // "Mark Paid" button (only for parent)
    let paidButton = null;
    if (currentRole === "parent") {
      paidButton = document.createElement("button");
      paidButton.textContent = "Mark Paid";
      paidButton.dataset.index = index;
      paidButton.addEventListener("click", function() {
        markPaid(parseInt(this.dataset.index));
      });
    }

    // Create the delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "❌";
    deleteButton.dataset.index = index;
    deleteButton.addEventListener("click", function() {
      deleteChore(parseInt(this.dataset.index));
    });

    // Add elements to div
    div.appendChild(checkboxContainer);
    div.appendChild(nameSpan);
    if (chore.done && chore.doneAt) div.appendChild(doneTime);
    if (paidButton) div.appendChild(paidButton);
    div.appendChild(deleteButton);

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
  if (chores[index].done) {
    chores[index].doneAt = new Date().toISOString();
  } else {
    chores[index].doneAt = null;
    chores[index].paid = false; // Unmark as paid if undone
  }
  saveChores(chores);
  renderChores();
}

function markPaid(index) {
  if (currentRole !== "parent") {
    alert("Only the parent can mark chores as paid.");
    return;
  }
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
    
    if (childrenChores[child].length === 0) {
      const noChoresMsg = document.createElement("p");
      noChoresMsg.textContent = "No chores assigned yet.";
      noChoresMsg.style.fontStyle = "italic";
      noChoresMsg.style.color = "#666";
      choresList.appendChild(noChoresMsg);
    } else {
      childrenChores[child].forEach((chore, index) => {
        const choreItem = document.createElement("div");
        choreItem.className = "chore";
        
        const status = chore.done ? (chore.paid ? "Paid" : "Done") : "Not Done";
        const statusClass = chore.done ? (chore.paid ? "paid" : "done") : "";
        
        // Create the chore name span
        const nameSpan = document.createElement("span");
        nameSpan.className = `chore-name ${statusClass}`;
        nameSpan.textContent = `${chore.name} ($${chore.rate})`;
        nameSpan.style.flex = "1"; // Take up available space
        
        // Done timestamp
        const doneTime = document.createElement("span");
        doneTime.className = "done-time";
        if (chore.done && chore.doneAt) {
          doneTime.textContent = `Done: ${new Date(chore.doneAt).toLocaleString()}`;
          doneTime.style.marginLeft = "10px";
          doneTime.style.fontSize = "0.8em";
          doneTime.style.color = "#888";
        }
        
        // "Mark Paid" button for parent
        let paidButton = null;
        if (!chore.paid && chore.done) {
          paidButton = document.createElement("button");
          paidButton.textContent = "Mark Paid";
          paidButton.addEventListener("click", function() {
            // Mark as paid in the child's storage
            const childChores = JSON.parse(localStorage.getItem(`chores_${child}`)) || [];
            childChores[index].paid = true;
            localStorage.setItem(`chores_${child}`, JSON.stringify(childChores));
            renderParentDashboard();
          });
        }
        
        // Add elements to the chore item
        choreItem.appendChild(nameSpan);
        if (chore.done && chore.doneAt) choreItem.appendChild(doneTime);
        if (paidButton) choreItem.appendChild(paidButton);
        
        // Status
        const statusSpan = document.createElement("span");
        statusSpan.className = "status";
        statusSpan.textContent = status;
        choreItem.appendChild(statusSpan);
        
        choresList.appendChild(choreItem);
      });
    }
    
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

// Check if loginSimple is defined
if (typeof loginSimple === 'function') {
  debug("loginSimple function is properly defined");
} else {
  debug("ERROR: loginSimple function is NOT properly defined");
}

// Function to reset a child's PIN
function resetPin() {
  if (currentRole !== 'parent') {
    alert("Only the parent can reset PINs");
    return;
  }
  
  const childName = document.getElementById("pin-reset-child").value;
  const newPin = document.getElementById("new-pin").value;
  
  if (!childName) {
    alert("Please select a child");
    return;
  }
  
  if (!newPin || newPin.length < 4) {
    alert("Please enter a valid PIN (at least 4 characters)");
    return;
  }
  
  if (!users[childName] || users[childName].role !== "child") {
    alert("Invalid child selected");
    return;
  }
  
  // Update the PIN
  users[childName].pin = newPin;
  saveUsers();
  
  // Clear the input field
  document.getElementById("new-pin").value = "";
  
  alert(`PIN for ${childName} has been updated successfully!`);
}

// Function to export all chore data to CSV
function exportChoreData() {
  if (currentRole !== 'parent') {
    alert("Only the parent can export data");
    return;
  }
  
  // Get all chore data
  const allChores = getChildrenChores();
  
  // Create CSV content
  let csvContent = "Child,Chore,Rate,Status,Completed Date\n";
  
  Object.keys(allChores).forEach(child => {
    allChores[child].forEach(chore => {
      const status = chore.paid ? "Paid" : (chore.done ? "Done" : "Not Done");
      const completedDate = chore.doneAt ? new Date(chore.doneAt).toLocaleString() : "N/A";
      
      // Add row to CSV
      csvContent += `"${child}","${chore.name}","$${chore.rate}","${status}","${completedDate}"\n`;
    });
  });
  
  // Create a blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Create and trigger download link
  const downloadLink = document.createElement("a");
  const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  downloadLink.href = url;
  downloadLink.download = `chore-data-${currentDate}.csv`;
  
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
