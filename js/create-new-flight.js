document.getElementById("goToDashboard").addEventListener("click", () => {
  window.location.href = "/admin-dashboard.html";
});
document
  .getElementById("bookingForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Format dates to YYYY-MM-DD
    const departureDate = new Date(
      document.getElementById("departureDate").value
    )
      .toISOString()
      .split("T")[0];
    const returnDate = new Date(document.getElementById("returnDate").value)
      .toISOString()
      .split("T")[0];

    // Collect form data into an object
    const formData = {
      airline: document.getElementById("airline").value,
      name: document.getElementById("nameOfPackage").value,
      origin: document.getElementById("departure").value,
      destination: document.getElementById("destination").value,
      departure_date: departureDate,
      return_date: returnDate,
      price: parseFloat(document.getElementById("price").value),
    };

    // Validate data
    if (
      !formData.airline ||
      !formData.name ||
      !formData.origin ||
      !formData.destination ||
      isNaN(formData.price)
    ) {
      alert("Please fill out all required fields correctly.");
      return;
    }

    const apiEndpoint =
      "https://bibilomo-project.onrender.com/api/flight/package/";

    // Get token from localStorage
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      alert("You are not logged in. Please log in and try again.");
      window.location.href = "index.html"; // Redirect to login page
      return;
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Add Authorization header
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        alert("Package created successfully!");
      } else if (response.status === 401) {
        alert(
          "Unauthorized! Your session might have expired. Please log in again."
        );
        localStorage.removeItem("access_token"); // Clear token
        window.location.href = "index.html"; // Redirect to login page
      } else {
        const error = await response.json();
        console.error("Server error details:", error);
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      alert(`Failed to connect to the server: ${err.message}`);
    }
  });
