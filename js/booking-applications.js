// booking-applications.js
document.addEventListener("DOMContentLoaded", async () => {
  const BASE_API_URL = "https://api.bibilomotravels.com.ng";
  const accessToken = localStorage.getItem("access_token");

  const bookingTotalCount = document.querySelectorAll("#bookingTotalCount");
  const bookingRecentCount = document.getElementById("#bookingRecentCount");
  const bookingApplicationsContainer = document.getElementById(
    "bookingApplicationsContainer"
  );
  const bookingSearchInput = document.getElementById("bookingSearchInput");
  const bookingFilterButton = document.getElementById("bookingFilterButton");

  let applications = [];

  try {
    const countResponse = await fetch(
      `${BASE_API_URL}/api/flight/booking-applications/count/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!countResponse.ok) {
      throw new Error("Failed to fetch booking application counts");
    }
    const { total_count, recent_count } = await countResponse.json();
    bookingTotalCount.forEach((element) => {
      element.textContent = total_count;
    });
    bookingRecentCount.forEach((element) => {
      element.textContent = recent_count;
    });

    const applicationsResponse = await fetch(
      `${BASE_API_URL}/api/flight/booking-applications/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!applicationsResponse.ok) {
      throw new Error("Failed to fetch booking applications");
    }
    applications = await applicationsResponse.json();
    renderApplications(applications);
  } catch (error) {
    console.error("Error fetching booking applications: ", error);
  }

  bookingFilterButton.addEventListener("click", () => {
    const searchTerm = bookingSearchInput.value.toLowerCase();
    const filteredApplications = applications.filter(
      ({ id, full_name, email, package: pkg }) => {
        return (
          id.toString().includes(searchTerm) ||
          full_name.toLowerCase().includes(searchTerm) ||
          email.toLowerCase().includes(searchTerm) ||
          (pkg?.name || "").toLowerCase().includes(searchTerm)
        );
      }
    );
    renderApplications(filteredApplications);
  });

  function renderApplications(applications) {
    bookingApplicationsContainer.innerHTML = "";
    applications.forEach(({ id, full_name, email, package: pkg }) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${full_name}</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Package:</strong> ${pkg?.name || "N/A"}</p>
        <button onclick="deleteApplication(${id})">Delete</button>
      `;
      bookingApplicationsContainer.appendChild(card);
    });
  }
});

async function deleteApplication(id) {
  const BASE_API_URL = "https://api.bibilomotravels.com.ng";
  const accessToken = localStorage.getItem("access_token");

  try {
    const response = await fetch(
      `${BASE_API_URL}/api/flight/booking-applications/${id}/`,
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
    document.getElementById("bookingApplicationsContainer").innerHTML = "";
    location.reload();
  } catch (error) {
    console.error("Error deleting booking application: ", error);
  }
}
