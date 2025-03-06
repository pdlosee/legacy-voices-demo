
let recognition;
let questionIndex = 0;
let responses = [];

function startRecording() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Your browser does not support Web Speech API. Please use Chrome or Edge.');
        return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
        }
        document.getElementById('storySummary').value = transcript;
    };

    recognition.start();
}

function stopRecording() {
    if (recognition) {
        recognition.stop();
    }
}
