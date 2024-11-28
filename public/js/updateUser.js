"use strict";

export async function updateUser(e) {
  e.preventDefault(); // Prevent the form from submitting by default

  // Create a FormData object
  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    city: document.getElementById("city").value,
    state: document.getElementById("state").value,
    country: document.getElementById("country").value,
    number: document.getElementById("number").value,
    summary: document.getElementById("summary").value
  };
  console.log(formData);

  try {
    const response = await fetch("/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData) // Send the form data as JSON
    });

    if (response.ok) {
      window.location.href = "/dashboard";
    } else {
      alert("Error updating profile");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
