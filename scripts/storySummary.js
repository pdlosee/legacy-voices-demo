function submitStorySummary() {
    let storySummary = document.getElementById("storyInput").value.trim();
    
    if (!storySummary) {
        alert("Please enter a valid story summary.");
        return;
    }

    // ✅ Store the summary in localStorage
    localStorage.setItem("storySummary", storySummary);
    console.log("✅ DEBUG: Story summary stored:", storySummary);

    // ✅ Debug to check if it's saved correctly
    let verifyStorage = localStorage.getItem("storySummary");
    console.log("✅ DEBUG: Retrieved from storage immediately:", verifyStorage);

    // ✅ Redirect to next step
    window.location.href = "recordResponses.html";
}
