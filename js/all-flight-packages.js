const BASE_API_URL = "https://api.bibilomotravels.com.ng";
const accessToken = localStorage.getItem("access_token");
const editModalElement = document.getElementById("editPackageModal");
const editPackageForm = document.getElementById("editPackageForm");
const editModal = new bootstrap.Modal(editModalElement); // Bootstrap modal instance

document.addEventListener("DOMContentLoaded", () => {
  const flightPackagesContainer = document.getElementById("flightPackages");
  const packageTotalCount = document.querySelectorAll("#packageTotalCount");
  const packageRecentCount = document.querySelectorAll("#packageRecentCount");
  const toggleViewBtn = document.getElementById("toggleViewBtn");
  let isArchivedView = false; // Tracks current view

  // Redirect if not authorized
  if (!accessToken) {
    alert("You are not authorized to access this page.");
    window.location.href = "index.html"; 
  }

  // Load initial active packages
  loadPackages();

  // Event listener for toggle view
  toggleViewBtn.addEventListener("click", () => {
    isArchivedView = !isArchivedView;
    toggleViewBtn.textContent = isArchivedView
      ? "View Active Packages"
      : "View Archived Packages";
    loadPackages();
  });

  // Fetch and display packages
  async function loadPackages() {
    flightPackagesContainer.innerHTML = "<p>Loading...</p>";
    const endpoint = isArchivedView
      ? `${BASE_API_URL}/flight/package/archive/archived_list/`
      : `${BASE_API_URL}/flight/package/list`;
    try {
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch packages");
      }

      const result = await response.json();
      const packages = isArchivedView ? result.data : result;

      flightPackagesContainer.innerHTML = "";

      if (packages.length === 0) {
        flightPackagesContainer.innerHTML =
          `<p>No ${isArchivedView ? "archived" : "active"} packages available at the moment.</p>`;
        return;
      }

      packages.forEach((pkg) => {
        const card = document.createElement("div");
        card.className = "package-card";
        card.innerHTML = `
          <figure>
            <img src="${pkg.placeholder_image || "placeholder.jpg"}" alt="${pkg.name}" />
          </figure>
          <article>
            <h3>${pkg.name}</h3>
            <p><strong>Flight Mode:</strong> ${pkg.flight_mode || "N/A"}</p>
            <p><strong>Class:</strong> ${pkg.flight_class || "N/A"}</p>
            <p><strong>Airline:</strong> ${pkg.airline}</p>
            <p><strong>Origin:</strong> ${pkg.origin}</p>
            <p><strong>Destination:</strong> ${pkg.destination}</p>
            <p><strong>Departure:</strong> ${new Date(pkg.departure_date).toDateString()}</p>
            <p><strong>Return:</strong> ${
              pkg.return_date
                ? new Date(pkg.return_date).toDateString()
                : "One-way"
            }</p>
            <p class="price"><strong>Price:</strong> $${pkg.price}</p>
            <button class="btn btn-primary" style="display: ${isArchivedView ? 'none' : 'inline-block'}" onclick="editPackage(${pkg.id})">Edit</button>
            <button class=" btn btn-${isArchivedView ? "warning" : "danger"}" onclick="${
              isArchivedView ? `restorePackage(${pkg.id})` : `archivePackage(${pkg.id})`
            }">${isArchivedView ? "Restore" : "Archive"}</button>
          </article>
        `;
        flightPackagesContainer.appendChild(card);
      });

      // Update counts for active view
      if (!isArchivedView) {
        updatePackageCounts();
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Update package counts
  async function updatePackageCounts() {
    try {
      const response = await fetch(`${BASE_API_URL}/flight/packages/count/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch package count");
      }

      const { total_active_count, recent_count } = await response.json();
      packageTotalCount.forEach((element) => {
        element.textContent = total_active_count;
      });
      packageRecentCount.forEach((element) => {
        element.textContent = recent_count;
      });
    } catch (error) {
      console.error("Failed to update package counts:", error);
    }
  }

});

  // Archive package
  async function archivePackage(id) {
    if (!confirm("Are you sure you want to archive this package?")) return;

    try {
      const response = await fetch(`${BASE_API_URL}/flight/package/archive/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.ok) {
        alert("Package archived successfully!");
        location.reload()
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      alert(`Server error: ${error.message}`);
    }
  }

  // Restore package
  async function restorePackage(id) {
    if (!confirm("Are you sure you want to restore this package?")) return;
    try {
      const response = await fetch(`${BASE_API_URL}/flight/package/archive/${id}/restore/`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.ok) {
        alert("Package restored successfully!");
        location.reload()
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      alert(`Server error: ${error.message}`);
    }
  }


// Edit package functionality
async function editPackage(id) {

  try {
    const response = await fetch(`${BASE_API_URL}/flight/package/list/${id}/`, {
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

    // Show the modal using Bootstrap API
    editModal.show();


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
        is_hidden: false,
      };

      try {
        const updateResponse = await fetch(
          `${BASE_API_URL}/flight/package/${id}/`,
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
          editModal.hide(); // Close the modal using Bootstrap API
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
    console.log("failed to updatepackage");
    alert(`Error: ${err.message}`);
  }
}

 // Logout functionality
 document.querySelectorAll("#logout-link").forEach((element) => {
  element.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "index.html";
  });
});