const BASE_API_URL = "https://api.bibilomotravels.com.ng";
const formContainer = document.getElementById("form-container");
const authForm = document.getElementById("auth-form");
const formTitle = document.getElementById("form-title");
const toggleLink = document.getElementById("toggle-link");
const errorMessage = document.getElementById("error-message");
const submitBtn = document.getElementById("submit-btn");

let isLoginMode = false;

toggleLink.addEventListener("click", () => {
  isLoginMode = !isLoginMode;
  if (!isLoginMode) {
    formTitle.textContent = "Login";
    toggleLink.textContent = "Don't have an account? Register";
    authForm.innerHTML = `
          <div class="form-group">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" required>
          </div>
          <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required>
          </div>
          <button type="submit" class="btn" id="submit-btn">Login</button>
      `;
  } else {
    formTitle.textContent = "Register";
    toggleLink.textContent = "Already have an account? Login";
    authForm.innerHTML = `
          <div class="form-group">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" required>
          </div>
          <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email">
          </div>
          <div class="form-group">
              <label for="first-name">First Name</label>
              <input type="text" id="first-name" name="first_name">
          </div>
          <div class="form-group">
              <label for="last-name">Last Name</label>
              <input type="text" id="last-name" name="last_name">
          </div>
          <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required>
          </div>
          <button type="submit" class="btn" id="submit-btn">Register</button>
      `;
  }
});

authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMessage.textContent = "";

  const formData = new FormData(authForm);
  const data = Object.fromEntries(formData.entries());
  submitBtn.textContent = "Loading...";

  // deactivated register endpoint. - Replace "" with "/admin/register" to activate
  const endpoint = !isLoginMode ? "/admin/login/" : ""; //"/admin/register";

  try {
    const response = await fetch(`${BASE_API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || "Authentication failed.");
    }

    const result = await response.json();
    if (!isLoginMode) {
      // Store tokens securely
      localStorage.setItem("access_token", result.access_token);
      localStorage.setItem("refresh_token", result.refresh_token);

      // Redirect to the dashboard
      window.location.href = "admin-dashboard.html";
    } else {
      alert("Registration successful! Please log in.");
      toggleLink.click(); // Switch to login form
    }
  } catch (error) {
    console.error("Error:", error);
    errorMessage.textContent = error.message;
    submitBtn.textContent = !isLoginMode ? "Login" : "Register";
  }
});
