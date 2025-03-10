let recognition;
let storyTranscript = '';

function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        let finalTranscript = document.getElementById('storyInput').value; // Keep existing text
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + " ";
            }
        }
        document.getElementById('storyInput').value = finalTranscript; // ✅ Update text field with transcript
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
