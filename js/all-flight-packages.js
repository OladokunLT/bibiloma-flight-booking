// Ensure the DOM is fully loaded before executing

document.addEventListener("DOMContentLoaded", async () => {
  const BASE_API_URL = "https://bibilomo-project.onrender.com";
  const flightPackagesContainer = document.getElementById("flightPackages");
  const accessToken = localStorage.getItem("access_token");

  // Protect dashboard and this page
  if (!accessToken) {
    alert("You are not authorized to access this page.");
    window.location.href = "index.html"; // Redirect to login
  }

  // Fetch all flight packages
  try {
    const response = await fetch(`${BASE_API_URL}/api/flight/packages`, {
      headers: { Authorization: `Bearer ${accessToken}` },
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
        <figure>
          <img src="${pkg.image || "placeholder.jpg"}" alt="${pkg.name}" />
        </figure>
        <article>
          <h3>${pkg.name}</h3>
          <p><strong>Flight Mode:</strong> ${pkg.flight_mode || "N/A"}</p>
          <p><strong>Class:</strong> ${pkg.flight_class || "N/A"}</p>
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
          <button class="btn-edit" onclick="editPackage(${
            pkg.id
          })">Edit</button>
          <button class="btn-delete" onclick="deletePackage(${
            pkg.id
          })">Delete</button>
        </article>
      `;
      flightPackagesContainer.appendChild(card);
    });
  } catch (error) {
    flightPackagesContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    console.log("Error", error);
  }
});

// Delete package functionality
async function deletePackage(id) {
  const BASE_API_URL = "https://bibilomo-project.onrender.com";
  const accessToken = localStorage.getItem("access_token");
  const confirmation = confirm("Are you sure you want to delete this package?");

  if (!confirmation) return;

  try {
    const response = await fetch(
      `${BASE_API_URL}/api/flight/package/${id}/delete/`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

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

// Edit package functionality
const editModal = document.getElementById("editPackageModal");
const closeModal = document.getElementById("closeModal");
const editPackageForm = document.getElementById("editPackageForm");

async function editPackage(id) {
  const BASE_API_URL = "https://bibilomo-project.onrender.com";
  const accessToken = localStorage.getItem("access_token");

  try {
    const response = await fetch(`${BASE_API_URL}/api/flight/package/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch package details");
    }

    const packageDetails = await response.json();

    // Populate the form fields
    document.getElementById("editName").value = packageDetails.name;
    document.getElementById("editAirline").value = packageDetails.airline;
    document.getElementById("editOrigin").value = packageDetails.origin;
    document.getElementById("editDestination").value =
      packageDetails.destination;
    document.getElementById("editFlightMode").value =
      packageDetails.flight_mode || "";
    document.getElementById("editFlightClass").value =
      packageDetails.flight_class || "";
    document.getElementById("editDepartureDate").value = new Date(
      packageDetails.departure_date
    )
      .toISOString()
      .split("T")[0];
    document.getElementById("editReturnDate").value = packageDetails.return_date
      ? new Date(packageDetails.return_date).toISOString().split("T")[0]
      : "";
    document.getElementById("editPrice").value = packageDetails.price;

    // Show the modal
    editModal.style.display = "block";

    editPackageForm.onsubmit = async function (e) {
      e.preventDefault();

      // Collect updated data
      const updatedData = {
        name: document.getElementById("editName").value,
        airline: document.getElementById("editAirline").value,
        origin: document.getElementById("editOrigin").value,
        destination: document.getElementById("editDestination").value,
        flight_mode: document.getElementById("editFlightMode").value,
        flight_class: document.getElementById("editFlightClass").value,
        departure_date: document.getElementById("editDepartureDate").value,
        return_date: document.getElementById("editReturnDate").value || null,
        price: parseFloat(document.getElementById("editPrice").value),
      };

      try {
        const updateResponse = await fetch(
          `${BASE_API_URL}/api/flight/package/${id}/update/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(updatedData),
          }
        );

        if (updateResponse.ok) {
          alert("Package updated successfully!");
          editModal.style.display = "none";
          location.reload();
        } else {
          const error = await updateResponse.json();
          alert(`Error: ${error.message}`);
        }
      } catch (err) {
        alert(`Server error: ${err.message}`);
      }
    };
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
}

// Close modal handlers
closeModal.onclick = () => {
  editModal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target === editModal) {
    editModal.style.display = "none";
  }
};

// Logout functionality
document.getElementById("logout-link").addEventListener("click", (event) => {
  event.preventDefault();

  // Clear tokens from localStorage
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  // Redirect to login
  window.location.href = "index.html";
});
