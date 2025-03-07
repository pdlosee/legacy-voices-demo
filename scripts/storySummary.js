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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storySummary: storySummary })
    })
    .then(response => response.json())
    .then(data => {
        if (data.questions) {
            sessionStorage.setItem('questions', JSON.stringify(data.questions));
            window.location.href = 'recordResponses.html';
        } else {
            alert('Failed to generate questions');
        }
    })
    .catch(err => console.error('Error contacting backend:', err));
}