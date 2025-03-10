let recognition;
let storyTranscript = '';

function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        let transcript = document.getElementById('storyInput').value;
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                transcript += event.results[i][0].transcript + " ";
            }
        }
        document.getElementById('storyInput').value = transcript;
    };

    recognition.onend = () => {
        console.log("⚠️ Speech recognition stopped. Restarting...");
        setTimeout(() => {
            if (recognition) recognition.start(); // ✅ Auto-restart after pause
        }, 500);
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
