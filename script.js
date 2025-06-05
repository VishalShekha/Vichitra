document.addEventListener("DOMContentLoaded", () => {
  const displayError = (element, message) => {
    const errorMessage = document.createElement("div");
    errorMessage.classList.add("error-message");
    errorMessage.textContent = message;
    if (
      !element.nextElementSibling ||
      !element.nextElementSibling.classList.contains("error-message")
    ) {
      element.insertAdjacentElement("afterend", errorMessage);
    }
  };

  const clearErrors = () => {
    document
      .querySelectorAll(".error-message")
      .forEach((error) => error.remove());
  };

  const checkPasswordStrength = (password) => {
    const minLength = /.{8,}/;
    const letterAndNumber = /^(?=.*[A-Za-z])(?=.*\d)/;
    const hasCharacter = /[^\s]/;

    return (
      minLength.test(password) &&
      letterAndNumber.test(password) &&
      hasCharacter.test(password)
    );
  };

  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");

    signupForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      clearErrors();

      const enteredUsername = usernameInput.value.trim();
      const enteredPassword = passwordInput.value;
      const enteredConfirmPassword = confirmPasswordInput.value;

      let isValid = true;

      if (!enteredUsername || !enteredPassword) {
        displayError(usernameInput, "Please fill in all fields.");
        isValid = false;
      }

      if (!checkPasswordStrength(enteredPassword)) {
        displayError(
          passwordInput,
          "Password must be at least 8 characters long, contain both letters and numbers, and have at least one character."
        );
        isValid = false;
      }

      if (enteredPassword !== enteredConfirmPassword) {
        displayError(confirmPasswordInput, "Passwords do not match.");
        isValid = false;
      }

      if (!isValid) return;

      try {
        const response = await fetch("http://localhost:3000/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: enteredUsername,
            password: enteredPassword,
          }),
        });

        let data;
        try {
          data = await response.json();
        } catch (err) {
          data = { error: "Unexpected server response" };
        }

        if (!response.ok) {
          displayError(usernameInput, data.error || "Signup failed");
        } else {
          alert("Account created successfully! You can now log in.");
          window.location.href = "./index.html";
        }
      } catch (error) {
        console.error("Signup error:", error);
      }
    });
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    const loginUsernameInput = document.getElementById("login-username");
    const loginPasswordInput = document.getElementById("login-password");

    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      clearErrors();

      const enteredUsername = loginUsernameInput.value.trim();
      const enteredPassword = loginPasswordInput.value;

      let isValid = true;

      if (!enteredUsername || !enteredPassword) {
        displayError(
          loginUsernameInput,
          "Please enter both username and password."
        );
        isValid = false;
      }

      if (!isValid) return;

      try {
        const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: enteredUsername,
            password: enteredPassword,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          displayError(
            loginPasswordInput,
            data.error || "Login failed. Try again."
          );
        } else {
          window.location.href = "./listPassword.html";
        }
      } catch (error) {
        console.error("Login error:", error);
      }
    });
  }
});
