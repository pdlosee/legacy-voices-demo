let recognition;

document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Page fully loaded, script executing...");
});

function startRecording() {
    const storyInput = document.getElementById("storyInput");
    
    if (!storyInput) {
        console.error("❌ ERROR: Element with ID 'storyInput' not found.");
        alert("Error: The story input field is missing. Please reload the page.");
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        let finalTranscript = storyInput.value;  // Keep existing text

        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + " ";
            }
        }

        storyInput.value = finalTranscript; // ✅ Update text field with transcript
    };

    recognition.onend = () => {
        console.log("Speech recognition stopped.");
    };

    recognition.start();
}

function stopRecording() {
    if (recognition) {
        recognition.stop();
    }
}

function submitStorySummary() {
    let storySummary = document.getElementById("storyInput").value.trim();

    if (!storySummary) {
        alert("Please enter a valid story summary.");
        return;
    }

    // ✅ Store the summary in localStorage
    localStorage.setItem("storySummary", storySummary);
    console.log("✅ DEBUG: Story summary stored:", storySummary);

    // ✅ Redirect to next step
    window.location.href = "recordResponses.html";
}
