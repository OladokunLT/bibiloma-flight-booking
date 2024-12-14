document.addEventListener("DOMContentLoaded", async () => {
  const BASE_API_URL = "https://bibilomo-project.onrender.com";
  const flightPackagesContainer = document.getElementById("flightPackages");
  const accessToken = localStorage.getItem("access_token");

  // Protect dashboard and this page
  if (!accessToken) {
    alert("You are not authorized to access this page.");
    window.location.href = "index.html"; // Redirect to login
  }
 
  // GET ALL PACKAGES
  try {
    const response = await fetch(`${BASE_API_URL}/api/flight/packages`, {
      headers: {Authorization: `Bearer ${accessToken}`}
    });

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
              <button class="btn-edit" onclick="editPackage(${pkg.id})">Edit</button>
              <button class="btn-delete" onclick="deletePackage(${pkg.id})">Delete</button>
          `;
      flightPackagesContainer.appendChild(card);
    });
  } catch (error) {
    flightPackagesContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    console.log("Error", error);
  }
});

// Delete package single package functionality
async function deletePackage(id) {
  const BASE_API_URL = "https://bibilomo-project.onrender.com";
  const accessToken = localStorage.getItem("access_token");
  const confirmation = confirm("Are you sure you want to delete this package?");

  if (!confirmation) return;

  try {
    const response = await fetch(`${BASE_API_URL}/api/flight/package/${id}/delete/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.ok) {
      alert("Package deleted successfully!");
      location.reload(); // Reload the page
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
    }
  } catch (err) {
    alert(`Server error: ${err.message}`);
  }
}

// update package functionality
async function editPackage(id) {
  const BASE_API_URL = "https://bibilomo-project.onrender.com";
  const accessToken = localStorage.getItem("access_token");
  const packageData = prompt("Enter updated package details (JSON format):");

  if (!packageData) return;

  try {
    const response = await fetch(`${BASE_API_URL}/api/flight/package/${id}/update/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: packageData,
    });

    if (response.ok) {
      alert("Package updated successfully!");
      location.reload(); // Reload the page
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
    }
  } catch (err) {
    alert(`Server error: ${err.message}`);
  }
}


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

