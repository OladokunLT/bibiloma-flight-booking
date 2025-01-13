const BASE_API_URL = "https://api.bibilomotravels.com.ng";
const access_token = localStorage.getItem("access_token");
const changePasswordForm = document.getElementById("changePasswordForm");

changePasswordForm.onsubmit = async (event) => {
  event.preventDefault();

  const updatedData = {
    old_password: document.getElementById("currentPassword").value,
    new_password: document.getElementById("newPassword").value,
    confirm_password: document.getElementById("confirmNewPassword").value,
  };

  const { old_password, new_password, confirm_password } = updatedData;

  // Compare new password and confirm password
  if (new_password !== confirm_password) {
    alert(
      "ErrorMessage: new password and confirm password input are not the same."
    );
    return;
  }
  try {
    const response = await fetch(`${BASE_API_URL}/admin/update-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      alert(
        `Password updated to ${new_password} successfully. Copy and save it, you will be logged out next and it is needed to login.`
      );

      //   clear the input field
      document.getElementById("currentPassword").value = "";
      document.getElementById("newPassword").value = "";
      document.getElementById("confirmNewPassword").value = "";

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "./index.html";
    } else {
      const err = await response.json();
      alert(`Error : ${err.message}`);
      console.error(`Error : ${err.message}`);
    }
  } catch (error) {
    console.error("Error: ", error.message);
  }
};
