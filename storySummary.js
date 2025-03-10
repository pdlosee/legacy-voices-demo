let recognition;
let isRecognizing = false;

function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;  // 🚨 Chrome limits continuous mode—so we restart manually
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        isRecognizing = true;
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

    recognition.onspeechend = () => {
        console.log("⏸️ No speech detected for 5 seconds, continuing to listen...");
        setTimeout(() => {
            if (isRecognizing) {
                recognition.start();  // ✅ Restart without stopping!
            }
        }, 5000); // **Extends pause time to 5 seconds**
    };

    recognition.onend = () => {
        isRecognizing = false;
        console.log("⚠️ Speech recognition stopped.");
        setTimeout(() => {
            if (!isRecognizing) {
                console.log("🔄 Restarting speech recognition...");
                startRecording();
            }
        }, 1000); // **Short delay before restarting**
    };

    recognition.onerror = (event) => {
        console.error("❌ Speech Recognition Error:", event.error);
        isRecognizing = false;
    };

    recognition.start();
}

function stopRecording() {
    if (recognition) {
        recognition.stop();
    }
}


function stopRecording() {
    if (recognition) {
        recognition.stop();
    }
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
