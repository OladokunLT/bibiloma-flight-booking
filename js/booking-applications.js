document.addEventListener("DOMContentLoaded", async () => {
  const BASE_API_URL = "https://api.bibilomotravels.com.ng";
  const accessToken = localStorage.getItem("access_token");

  const bookingTotalCount = document.querySelectorAll("#bookingTotalCount");
  const bookingRecentCount = document.querySelectorAll("#bookingRecentCount");
  const bookingApplicationsContainer = document.getElementById(
    "bookingApplicationsContainer"
  );
  const bookingSearchInput = document.getElementById("bookingSearchInput");
  const bookingFilterButton = document.getElementById("bookingFilterButton");
  const toggleArchivedButton = document.getElementById("toggleArchived");
  const loader = document.getElementById("loader");

  if (!accessToken) {
    window.location.href = "index.html";
    alert("You don't have access to this page.");
  }

  let applications = [];
  let showArchived = false;

  const showLoader = () => (loader.style.display = "flex");
  const hideLoader = () => (loader.style.display = "none");

  const fetchApplications = async () => {
    showLoader();
    try {
      const countResponse = await fetch(
        `${BASE_API_URL}/flight/booking-applications/count/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!countResponse.ok) {
        throw new Error("Failed to fetch booking application counts");
      }
      const { total_active_count, recent_count } = await countResponse.json();
      bookingTotalCount.forEach((element) => {
        element.textContent = total_active_count;
      });
      bookingRecentCount.forEach((element) => {
        element.textContent = recent_count;
      });

      // Fetch active bookings
      const activeResponse = await fetch(
        `${BASE_API_URL}/flight/booking-application/list/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!activeResponse.ok) {
        throw new Error("Failed to fetch active booking applications");
      }
      const activeApplications = await activeResponse.json();

      // Fetch archived bookings
      const archivedResponse = await fetch(
        `${BASE_API_URL}/flight/booking-application/archive/archived_list/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!archivedResponse.ok) {
        throw new Error("Failed to fetch archived booking applications");
      }
      const archivedApplications = await archivedResponse.json();

      // Combine active and archived bookings
      applications = [
        ...activeApplications.map((app) => ({ ...app, archived: false })), // Mark active bookings
        ...archivedApplications.data.map((app) => ({ ...app, archived: true })), // Mark archived bookings
      ];

      renderApplications(applications);
    } catch (error) {
      console.error("Error fetching booking applications: ", error);
    } finally {
      hideLoader();
    }
  };

  const renderApplications = (applications) => {
    bookingApplicationsContainer.innerHTML = ""; // Clear the container

    if (applications.length === 0) {
      bookingApplicationsContainer.innerHTML = `
        <div class="col">
          <div class="card h-100">
            <div class="card-body">
              <p class="card-text">No booking applications found.</p>
            </div>
          </div>
        </div>
      `;
      return;
    }

    const filteredApplications = applications.filter(
      (application) => showArchived === application.archived
    );

    if (filteredApplications.length === 0) {
      bookingApplicationsContainer.innerHTML = `
        <div class="col">
          <div class="card h-100">
            <div class="card-body">
              <p class="card-text">No ${
                showArchived ? "archived" : "active"
              } bookings found.</p>
            </div>
          </div>
        </div>
      `;
      return;
    }

    filteredApplications.forEach((application) => {
      const card = document.createElement("div");
      card.className = "col";
      card.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <p><strong>Booking(passenger) ID:</strong> ${application.id}</p>
            <p><strong>Package ID:</strong> ${application.package || "N/A"}</p>
            <p><strong>First Name:</strong> ${application.first_name}</p>
            <p><strong>Last Name:</strong> ${application.last_name}</p>
            <p><strong>Email:</strong> ${application.email}</p>
            <p><strong>Phone Number:</strong> ${application.phone_number}</p>
            <p><strong>Number of Passengers:</strong> ${
              application.number_of_passengers
            }</p>
            <p><strong>Gender:</strong> ${application.gender}</p>
            <p><strong>Nationality:</strong> ${application.nationality}</p>
            
            ${
              application.archived
                ? `<button class="btn btn-success" onclick="restoreApplication(${application.id})">Restore</button>`
                : `<button class="btn btn-danger" onclick="deleteApplication(${application.id})">Archive</button>`
            }
          </div>
        </div>
      `;
      bookingApplicationsContainer.appendChild(card);
    });
  };

  bookingFilterButton.addEventListener("click", () => {
    const searchTerm = bookingSearchInput.value.toLowerCase();
    const filteredApplications = applications.filter(
      ({ id, first_name, last_name, email, package: pkg }) => {
        return (
          id.toString().includes(searchTerm) ||
          first_name.toLowerCase().includes(searchTerm) ||
          last_name.toLowerCase().includes(searchTerm) ||
          email.toLowerCase().includes(searchTerm) ||
          (pkg?.toString() || "").toLowerCase().includes(searchTerm)
        );
      }
    );
    renderApplications(filteredApplications);
  });

  toggleArchivedButton.addEventListener("click", () => {
    showArchived = !showArchived;
    toggleArchivedButton.textContent = showArchived
      ? "Show Active"
      : "Show Archived";
    renderApplications(applications);
  });

  fetchApplications();
});

async function deleteApplication(id) {
  const BASE_API_URL = "https://api.bibilomotravels.com.ng";
  const accessToken = localStorage.getItem("access_token");

  // Confirm before archiving
  if (!confirm("Are you sure you want to archive this booking application?")) {
    return;
  }

  try {
    const response = await fetch(
      `${BASE_API_URL}/flight/booking-application/archive/${id}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete booking application");
    }
    alert("Booking application archived successfully");
    // Refetch applications after deletion
    location.reload();
  } catch (error) {
    console.error("Error deleting booking application: ", error);
  }
}

async function restoreApplication(id) {
  const BASE_API_URL = "https://api.bibilomotravels.com.ng";
  const accessToken = localStorage.getItem("access_token");

  // Confirm before restoring
  if (!confirm("Are you sure you want to restore this booking application?")) {
    return;
  }

  try {
    const response = await fetch(
      `${BASE_API_URL}/flight/booking-application/archive/${id}/restore/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to restore booking application");
    }
    // Refetch applications after restoration
    location.reload();
    alert("Booking application restored successfully");
  } catch (error) {
    console.error("Error restoring booking application: ", error);
  }
}
