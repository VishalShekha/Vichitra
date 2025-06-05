document.addEventListener("DOMContentLoaded", () => {
  const passwordList = document.getElementById("passwordList");
  const copyDialog = document.getElementById("copyDialog");
  const copyMessage = document.getElementById("copyMessage");
  const closeCopyDialog = document.getElementById("closeCopyDialog");
  const editDialog = document.getElementById("editDialog");
  const editUsername = document.getElementById("editUsername");
  const editPassword = document.getElementById("editPassword");
  const saveEditButton = document.getElementById("saveEditButton");
  const closeEditDialog = document.getElementById("closeEditDialog");
  const addPasswordBtn = document.querySelector(".add-password");
  const passwordModal = document.getElementById("passwordModal");
  const savePasswordBtn = document.getElementById("savePassword");
  const cancelPasswordBtn = document.getElementById("cancelPassword");

  let passwords = [];

  async function fetchPasswords() {
    try {
      const res = await fetch("http://localhost:3000/api/passwords");
      const data = await res.json();
      passwords = data;
      renderPasswords();
    } catch (err) {
      console.error("Failed to load passwords", err);
    }
  }

  function getPasswordStrength(password) {
    const strengthChecks = [/.{8,}/, /[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/];

    let strength = 0;
    strengthChecks.forEach((check) => {
      if (check.test(password)) {
        strength++;
      }
    });

    if (strength === 1) return "Very Weak";
    if (strength === 2) return "Weak";
    if (strength === 3) return "Moderate";
    if (strength === 4) return "Strong";
    return "Very Strong";
  }

  function renderPasswords() {
    passwordList.innerHTML = "";
    passwords.forEach((entry, index) => {
      const passwordStrength = getPasswordStrength(entry.password);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${entry.website}</td>
        <td>${entry.username}</td>
        <td>${passwordStrength}</td>
        <td>
          <button class="action-button copy-btn" data-id="${entry.id}" data-type="username">Copy Username</button>
          <button class="action-button copy-btn" data-id="${entry.id}" data-type="password">Copy Password</button>
          <button class="action-button edit-btn" data-id="${entry.id}">Edit</button>
          <button class="action-button delete-btn" data-id="${entry.id}">Delete</button>
        </td>
      `;
      passwordList.appendChild(row);
    });
  }

  function copyToClipboard(text, type) {
    navigator.clipboard.writeText(text).then(() => {
      copyMessage.textContent = `${type} copied successfully!`;
      copyDialog.style.display = "block";
    });
  }

  passwordList.addEventListener("click", async (e) => {
    const id = e.target.getAttribute("data-id");
    const entry = passwords.find((p) => p.id == id);

    if (e.target.classList.contains("copy-btn")) {
      const type = e.target.getAttribute("data-type");
      copyToClipboard(entry[type], type);
    } else if (e.target.classList.contains("edit-btn")) {
      editUsername.value = entry.username;
      editPassword.value = entry.password;
      editDialog.setAttribute("data-id", id);
      editDialog.style.display = "block";
    } else if (e.target.classList.contains("delete-btn")) {
      await fetch(`http://localhost:3000/api/passwords/${id}`, {
        method: "DELETE",
      });
      fetchPasswords();
    }
  });

  saveEditButton.addEventListener("click", async () => {
    const id = editDialog.getAttribute("data-id");
    const username = editUsername.value;
    const password = editPassword.value;

    await fetch(`http://localhost:3000/api/passwords/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    editDialog.style.display = "none";
    fetchPasswords();
  });

  closeCopyDialog.addEventListener(
    "click",
    () => (copyDialog.style.display = "none")
  );
  closeEditDialog.addEventListener(
    "click",
    () => (editDialog.style.display = "none")
  );
  addPasswordBtn.addEventListener(
    "click",
    () => (passwordModal.style.display = "block")
  );
  cancelPasswordBtn.addEventListener(
    "click",
    () => (passwordModal.style.display = "none")
  );

  savePasswordBtn.addEventListener("click", async () => {
    const website = document.getElementById("website").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (website && username && password) {
      await fetch("http://localhost:3000/api/passwords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website, username, password }),
      });
      passwordModal.style.display = "none";
      fetchPasswords();
    } else {
      alert("All fields are required!");
    }
  });

  const passwordInput = document.getElementById("password");
  passwordInput.addEventListener("input", () => {
    const passwordStrength = getPasswordStrength(passwordInput.value);
    document.getElementById("passwordStrengthDisplay").textContent =
      passwordStrength;
  });

  fetchPasswords();
});
