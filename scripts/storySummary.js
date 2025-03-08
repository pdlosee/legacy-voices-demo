let recognition;
function startRecording() {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
        document.getElementById('storySummaryInput').value = transcript;
    };

    recognition.start();
}

function stopRecording() {
    if (recognition) {
        recognition.stop();
    }
}

function submitStorySummary() {
    const storySummary = document.getElementById('storySummaryInput').value;
    sessionStorage.setItem('storySummary', storySummary);

   fetch('https://legacy-voices-backend.onrender.com/generate-questions', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ storySummary })
})
.then(response => response.json())
.then(data => {
    if (data.questions) {
        console.log("Questions received:", data.questions);  // ✅ Debugging step
        
        // ✅ Fix: Store questions in localStorage
        localStorage.setItem("generatedQuestions", JSON.stringify(data.questions));
        console.log("Questions saved to localStorage."); // ✅ Confirm storage

        // ✅ Move to the next page only AFTER saving the questions
        window.location.href = "recordResponses.html";
    } else {
        alert("Error: No questions received.");
    }
})
.catch(error => console.error("Error contacting backend:", error));

}