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
  const toggleArchivedButton = document.getElementById("toggleArchived");
  const loader = document.getElementById("loader");

  if (!accessToken) {
    window.location.href = "./index.html";
    alert("You don't have access to this page.");
  }

  let messages = [];
  let showArchived = false;

  const showLoader = () => (loader.style.display = "flex");
  const hideLoader = () => (loader.style.display = "none");

  const fetchContacts = async () => {
    showLoader();
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
      contactRecentCount.forEach((element) => {
        element.textContent = recent_count;
      });

      // Fetch active contacts
      const activeResponse = await fetch(
        `${BASE_API_URL}/flight/contact-message/check/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!activeResponse.ok) {
        throw new Error("Failed to fetch active contact messages");
      }
      const activeMessages = await activeResponse.json();

      // Fetch archived contacts
      const archivedResponse = await fetch(
        `${BASE_API_URL}/flight/contact-message/archive/archived_list/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!archivedResponse.ok) {
        throw new Error("Failed to fetch archived contact messages");
      }
      const archivedMessages = await archivedResponse.json();

      // Combine active and archived messages
      messages = [
        ...activeMessages.map((msg) => ({ ...msg, archived: false })),
        ...archivedMessages.data.map((msg) => ({ ...msg, archived: true })),
      ];

      renderMessages(messages);
    } catch (error) {
      console.error("Error fetching contact messages: ", error);
    } finally {
      hideLoader();
    }
  };

  function renderMessages(messages) {
    contactMessagesContainer.innerHTML = "";

    if (messages.length === 0) {
      contactMessagesContainer.innerHTML = `
        <div class="col">
          <div class="card h-100">
            <div class="card-body">
              <p class="card-text">No contact messages found.</p>
            </div>
          </div>
        </div>
      `;
      return;
    }

    const filteredMessages = messages.filter(
      (message) => showArchived === message.archived
    );

    if (filteredMessages.length === 0) {
      contactMessagesContainer.innerHTML = `
         <div class="col">
          <div class="card h-100">
            <div class="card-body">
              <p class="card-text">No ${
                showArchived ? "archived" : "active"
              } messages found.</p>
            </div>
          </div>
        </div>
      `;
      return;
    }

    filteredMessages.forEach(({ id, full_name, email, message, archived }) => {
      const card = document.createElement("div");
      card.className = "col";
      card.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <p><strong>ID:</strong>${id}</p>
            <p><strong>Fullname:</strong>${full_name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message</strong></p>
            <p>${message}</p>
            ${
              archived
                ? `<button class="btn btn-success" onclick="restoreMessage(${id})">Restore</button>`
                : `<button class="btn btn-danger" onclick="deleteMessage(${id})">Archive</button>`
            }
          </div>
        </div>
      `;
      contactMessagesContainer.appendChild(card);
    });
  }

  contactFilterButton.addEventListener("click", () => {
    const searchTerm = contactSearchInput.value.toLowerCase();
    const filteredMessages = messages.filter(
      ({ id, full_name, email, message }) => {
        return (
          id.toString().includes(searchTerm) ||
          full_name.toLowerCase().includes(searchTerm) ||
          email.toLowerCase().includes(searchTerm) ||
          message.toLowerCase().includes(searchTerm)
        );
      }
    );
    renderMessages(filteredMessages);
  });

  toggleArchivedButton.addEventListener("click", () => {
    showArchived = !showArchived;
    toggleArchivedButton.textContent = showArchived
      ? "Show Active"
      : "Show Archived";
    renderMessages(messages);
  });

  fetchContacts();
});

async function deleteMessage(id) {
  const BASE_API_URL = "https://api.bibilomotravels.com.ng";
  const accessToken = localStorage.getItem("access_token");

  // Confirm before archiving
  if (!confirm("Are you sure you want to archive this booking application?")) {
    return;
  }

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
    alert("Message archived successflly");
    location.reload();
  } catch (error) {
    console.error("Error deleting contact message: ", error);
  }
}

async function restoreMessage(id) {
  const BASE_API_URL = "https://api.bibilomotravels.com.ng";
  const accessToken = localStorage.getItem("access_token");

  // Confirm before restoring
  if (!confirm("Are you sure you want to restore this booking application?")) {
    return;
  }

  try {
    const response = await fetch(
      `${BASE_API_URL}/flight/contact-message/archive/${id}/restore/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to restore messages");
    }
    // Refetch applications after restoration
    location.reload();
    alert("message restored successfully");
  } catch (error) {
    console.error("Error restoring message: ", error);
  }
}
