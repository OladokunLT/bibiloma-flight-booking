document.addEventListener("DOMContentLoaded", async () => {
  const BASE_API_URL = "https://bibilomo-project.onrender.com";
  const flightPackagesContainer = document.getElementById("flightPackages");

  try {
    const response = await fetch(`${BASE_API_URL}/flight/packages`);

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
                pkg.departureDate
              ).toLocaleDateString()}</p>
              <p><strong>Return:</strong> ${
                pkg.returnDate
                  ? new Date(pkg.returnDate).toLocaleDateString()
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
