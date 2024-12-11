document
  .getElementById("bookingForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Collect form data into an object
    const formData = {
      airline: document.getElementById("airline").value,
      name: document.getElementById("nameOfPackage").value,
      origin: document.getElementById("departure").value,
      destination: document.getElementById("destination").value,
      departureDate: document.getElementById("departureDate").value,
      returnDate: document.getElementById("returnDate").value,
      price: parseFloat(document.getElementById("price").value),
    };

    const apiEndpoint = "https://bibilomo-project.onrender.com/flight/package";

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        alert("Package booked successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      alert(`Failed to connect to the server: ${err.message}`);
    }
  });

