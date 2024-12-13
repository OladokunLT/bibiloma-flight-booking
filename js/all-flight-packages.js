document.addEventListener("DOMContentLoaded", async () => {
  const BASE_API_URL = "https://bibilomo-project.onrender.com";
  const flightPackagesContainer = document.getElementById("flightPackages");

  try {
    const response = await fetch(`${BASE_API_URL}/api/flight/packages`);

    if (!response.ok) {
      throw new Error("Failed to fetch flight packages");
    }

    const packages = await response.json();
    console.log(packages);

    if (packages.length === 0) {
      flightPackagesContainer.innerHTML =
        "<p>No flight packages available at the moment.</p>";
      return;
    }

    packages.forEach((pkg) => {
      const card = document.createElement("div");
      card.className = "package-card";
      card.innerHTML = `
              <h3>${pkg.name}</h3>
              <p><strong>Airline:</strong> ${pkg.airline}</p>
              <p><strong>Origin:</strong> ${pkg.origin}</p>
              <p><strong>Destination:</strong> ${pkg.destination}</p>
              <p><strong>Departure:</strong> ${new Date(
                pkg.departure_date
              ).toDateString()}</p>
              <p><strong>Return:</strong> ${
                pkg.return_date
                  ? new Date(pkg.return_date).toDateString()
                  : "One-way"
              }</p>
              <p class="price"><strong>Price:</strong> $${pkg.price}</p>
          `;
      flightPackagesContainer.appendChild(card);
    });
  } catch (error) {
    flightPackagesContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    console.log("Error", error);
  }
});

// logout admin functionality
document.getElementById("logout-link").addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default navigation behavior

  // Clear tokens from localStorage
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  // Verify tokens are removed
  console.log("Access Token:", localStorage.getItem("access_token"));
  console.log("Refresh Token:", localStorage.getItem("refresh_token"));

  // Redirect to the login page
  window.location.href = "index.html";
});
