let recognition;

let recognition;
let isRecognizing = false;  // ✅ Tracks if speech recognition is running

function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;  // ✅ Keeps listening after pauses
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        isRecognizing = true;  // ✅ Mark that recognition is running
        console.log("🎤 Speech recognition started.");
    };

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
        isRecognizing = false;  // ❌ Mark that recognition stopped
        console.log("⚠️ Speech recognition stopped.");
    };

    recognition.onerror = (event) => {
        console.error("❌ Speech Recognition Error:", event.error);
        isRecognizing = false;  
    };

    recognition.start();

    // ✅ Force restart every 1 second if speech recognition stops
    setInterval(() => {
        if (!isRecognizing) {
            console.log("🔄 Auto-restarting speech recognition...");
            recognition.start();
        }
    }, 1000);  // **Reduced delay from 2000ms to 1000ms**
}



function stopRecording() {
    if (recognition) {
        recognition.stop();
        console.log("🛑 Speech recognition manually stopped.");
    }
}

function submitStorySummary() {
    const storySummary = document.getElementById("storyInput").value.trim();
    
    if (!storySummary) {
        alert("Please enter or record a story summary before submitting.");
        return;
    }

    localStorage.setItem("storySummary", storySummary);
    console.log("📜 Story summary saved:", storySummary);

    fetch("https://legacy-voices-backend.onrender.com/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storySummary }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.questions) {
            localStorage.setItem("generatedQuestions", JSON.stringify(data.questions));
            console.log("✅ Questions received:", data.questions);
            window.location.href = "recordResponses.html";
        } else {
            alert("Error: No questions were generated. Please try again.");
        }
    })
    .catch(error => {
        console.error("❌ Error contacting backend:", error);
        alert("Server error: Unable to generate questions.");
    });
}
