function requestProfileUpdate() {
    let userId = localStorage.getItem("user_id");

    fetch("https://your-backend-url/update-character-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("profileUpdateMessage").innerText = data.message;
        if (data.profile_update) {
            document.getElementById("profileUpdateSuggestion").value = data.profile_update;
        }
    })
    .catch(error => console.error("Error checking for updates:", error));
}

function acceptProfileUpdate() {
    let userId = localStorage.getItem("user_id");
    let newProfile = document.getElementById("profileUpdateSuggestion").value;

    fetch("https://your-backend-url/accept-profile-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, new_profile: newProfile })
    }).then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error("Error updating profile:", error));
}