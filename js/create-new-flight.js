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
      departure_date: document.getElementById("departureDate").value,
      return_date: document.getElementById("returnDate").value,
      price: document.getElementById("price").value,
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

// document
//   .getElementById("bookingForm")
//   .addEventListener("submit", async function (e) {
//     e.preventDefault();

//     const formData = new FormData();

//     // Append other form fields
//     formData.append("airline", document.getElementById("airline").value);
//     formData.append("name", document.getElementById("nameOfPackage").value);
//     formData.append("origin", document.getElementById("departure").value);
//     formData.append(
//       "destination",
//       document.getElementById("destination").value
//     );
//     formData.append(
//       "departure_date",
//       document.getElementById("departureDate").value
//     );
//     formData.append("return_date", document.getElementById("returnDate").value);
//     formData.append("price", document.getElementById("price").value);

//     const apiEndpoint = "https://bibilomo-project.onrender.com/flight/package";

//     try {
//       const response = await fetch(apiEndpoint, {
//         method: "POST",
//         body: formData,
//       });
//       console.log(formData);
//       console.log(response);

//       if (response.ok) {
//         const result = await response.json();
//         console.log(result);
//       } else {
//         const error = await response.json();
//         alert(`Error: ${error.message}`);
//       }
//     } catch (err) {
//       alert(`Failed to connect to the server: ${err.message}`);
//     }
//   });
