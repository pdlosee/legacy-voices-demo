let recognition;
let finalTranscript = "";  // This stores the accumulated full story

function startRecording() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Your browser does not support Web Speech API. Please use Chrome or Edge.');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;    // Keep listening even if there's a pause
    recognition.interimResults = true; // Show partial results as they happen
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        finalTranscript = "";  // Clear any previous transcript
        document.getElementById('storySummary').value = "Listening...";  // Optional feedback
    };

    recognition.onresult = (event) => {
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + " ";
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        document.getElementById('storySummary').value = finalTranscript + interimTranscript;
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        alert("Error during speech recognition: " + event.error);
    };

    recognition.onend = () => {
        document.getElementById('storySummary').value = finalTranscript;
    };

    recognition.start();
}

function stopRecording() {
    if (recognition) {
        recognition.stop();
    }
}
