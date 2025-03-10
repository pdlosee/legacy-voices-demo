let recognition;
let isRecognizing = false;
let accumulatedTranscript = ''; // ✅ Stores all transcriptions across restarts

function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;  // 🚨 Chrome does not allow true continuous mode
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        isRecognizing = true;
        console.log("🎤 Speech recognition started.");
    };

    recognition.onresult = (event) => {
        let newTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                newTranscript += event.results[i][0].transcript + " ";
            }
        }

        // ✅ Append new text to the previously accumulated text
        accumulatedTranscript += newTranscript;
        document.getElementById('storyInput').value = accumulatedTranscript;
    };

    recognition.onend = () => {
        isRecognizing = false;
        console.log("⚠️ Speech recognition stopped. Restarting immediately...");
        
        // ✅ Automatically restart recognition with a short delay
        setTimeout(() => {
            if (!isRecognizing) {
                startRecording();
            }
        }, 100);  // **100ms delay to avoid recursion issues**
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
