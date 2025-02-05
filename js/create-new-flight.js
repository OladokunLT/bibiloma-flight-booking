document.addEventListener("DOMContentLoaded", () => {
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    alert("You don't have access to this page.");
    window.location.href = "index.html";
  }
});

document.getElementById("goToDashboard").addEventListener("click", () => {
  window.location.href = "./admin-dashboard.html";
});

document
  .getElementById("bookingForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const BASE_API_URL = "https://api.bibilomotravels.com.ng";

    // Format dates to YYYY-MM-DD
    const departureDate = new Date(
      document.getElementById("departureDate").value
    )
      .toISOString()
      .split("T")[0];
    const returnDate = document.getElementById("returnDate").value
      ? new Date(document.getElementById("returnDate").value)
          .toISOString()
          .split("T")[0]
      : null;

    // Collect form data into an object
    const formData = {
      name: document.getElementById("nameOfPackage").value,
      destination: document.getElementById("destination").value,
      placeholder_image: document.getElementById("imageUpload").files[0]
        ? await convertImageToBase64(
            document.getElementById("imageUpload").files[0]
          )
        : null, // Convert image file to Base64
      flight_mode: document.querySelector('input[name="flightMode"]:checked')
        ?.value,
      flight_class: document.getElementById("flightClass").value,
      origin: document.getElementById("departure").value,
      price: document.getElementById("price").value,
      airline: document.getElementById("airline").value,
      departure_date: departureDate,
      return_date: returnDate,
      is_hidden: false,
    };

    // Validate data
    if (
      !formData.name ||
      !formData.destination ||
      !formData.origin ||
      !formData.flight_mode ||
      !formData.flight_class ||
      isNaN(parseFloat(formData.price)) ||
      !formData.airline ||
      !formData.departure_date
    ) {
      alert("Please fill out all required fields correctly.");
      return;
    }

    // Convert price to a string (as required by the backend)
    formData.price = formData.price.toString();

    // Get token from localStorage
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      alert("You are not logged in. Please log in and try again.");
      window.location.href = "index.html"; // Redirect to login page
      return;
    }

    try {
      const response = await fetch(`${BASE_API_URL}/flight/package/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Add Authorization header
        },
        body: JSON.stringify(formData), // Send data as JSON
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
        alert(`Error: ${error.message || "Failed to create package"}`);
      }
    } catch (err) {
      alert(`Failed to connect to the server: ${err.message}`);
    }
  });

// Function to convert image to Base64
async function convertImageToBase64(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result.split(",")[1]); // Extract only the Base64 string
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Preview image upload
document.getElementById("imageUpload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const previewContainer = document.getElementById("imagePreview");
  previewContainer.innerHTML = "";

  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const imgElement = document.createElement("img");
      imgElement.src = event.target.result;
      imgElement.alt = "Uploaded Preview";
      previewContainer.appendChild(imgElement);
    };
    reader.readAsDataURL(file);
  } else {
    previewContainer.innerHTML = "<p>Preview will appear here</p>";
  }
});
