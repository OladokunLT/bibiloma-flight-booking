document.addEventListener("DOMContentLoaded", async () => {
  const BASE_API_URL = "https://api.bibilomotravels.com.ng";
  const accessToken = localStorage.getItem("access_token");

  const contactTotalCount = document.querySelectorAll("#contactTotalCount");
  const contactRecentCount = document.querySelectorAll("#contactRecentCount");
  const contactMessagesContainer = document.getElementById(
    "contactMessagesContainer"
  );
  const contactSearchInput = document.getElementById("contactSearchInput");
  const contactFilterButton = document.getElementById("contactFilterButton");

  let messages = [];

  try {
    const countResponse = await fetch(
      `${BASE_API_URL}/flight/contact-messages/count/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!countResponse.ok) {
      throw new Error("Failed to fetch contact message counts");
    }
    const { total_active_count, recent_count } = await countResponse.json();
    contactTotalCount.forEach((element) => {
      element.textContent = total_active_count;
    });
    // contactTotalCount.textContent = total_active_count;
    contactRecentCount.forEach((element) => {
      element.textContent = recent_count;
    });
    // contactRecentCount.textContent = recent_count;

    const messagesResponse = await fetch(
      `${BASE_API_URL}/flight/contact-message/check/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!messagesResponse.ok) {
      throw new Error("Failed to fetch contact messages");
    }
    messages = await messagesResponse.json();
    renderMessages(messages);
  } catch (error) {
    console.error("Error fetching contact messages: ", error);
  }

  contactFilterButton.addEventListener("click", () => {
    const searchTerm = contactSearchInput.value.toLowerCase();
    const filteredMessages = messages.filter(
      ({ full_name, email, message }) => {
        return (
          full_name.toLowerCase().includes(searchTerm) ||
          email.toLowerCase().includes(searchTerm) ||
          message.toLowerCase().includes(searchTerm)
        );
      }
    );
    renderMessages(filteredMessages);
  });

  function renderMessages(messages) {
    contactMessagesContainer.innerHTML = "";
    messages.forEach(({ id, full_name, email, message }) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${full_name}</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p>${message}</p>
        <button onclick="deleteMessage(${id})">Delete</button>
      `;
      contactMessagesContainer.appendChild(card);
    });
  }
});

async function deleteMessage(id) {
  const BASE_API_URL = "https://api.bibilomotravels.com.ng";
  const accessToken = localStorage.getItem("access_token");

  try {
    const response = await fetch(
      `${BASE_API_URL}/flight/contact-message/archive/${id}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete contact message");
    }
    document.getElementById("contactMessagesContainer").innerHTML = "";
    location.reload();
  } catch (error) {
    console.error("Error deleting contact message: ", error);
  }
}
