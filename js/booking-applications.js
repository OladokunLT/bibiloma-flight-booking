// booking-applications.js
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

  if (!accessToken) {
    window.location.href = "index.html";
    alert("You don't have access to this page.");
  }

  let applications = [];

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

    const applicationsResponse = await fetch(
      `${BASE_API_URL}/flight/booking-application/list/`,
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
    applications.forEach(
      ({
        id,
        first_name,
        last_name,
        email,
        phone_number,
        package: pkg,
        number_of_passengers,
        gender,
        nationality,
      }) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
        <p> <strong>Booking(passenger) ID: </strong> ${id} </p>
        <p> <strong>Package ID: </strong> ${pkg} </p>
        <p> <strong>FirstName: </strong> ${first_name} </p>
        <p> <strong>FirstName: </strong> ${last_name} </p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${phone_number}</p>
        <p><strong>Number of Passenger:</strong> ${number_of_passengers}</p>
        <p><strong>Gender:</strong> ${gender}</p>
        <p><strong>Nationality:</strong> ${nationality}</p>

        <button class="btn btn-danger" onclick="deleteApplication(${id})">Delete</button>
      `;
        bookingApplicationsContainer.appendChild(card);
      }
    );
  }
});

async function deleteApplication(id) {
  const BASE_API_URL = "https://api.bibilomotravels.com.ng";
  const accessToken = localStorage.getItem("access_token");

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
    document.getElementById("bookingApplicationsContainer").innerHTML = "";
    location.reload();
  } catch (error) {
    console.error("Error deleting booking application: ", error);
  }
}
