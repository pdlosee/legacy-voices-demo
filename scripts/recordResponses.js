window.onload = function() {
    const questions = JSON.parse(sessionStorage.getItem('questions')) || [];
    const container = document.getElementById('questionsContainer');

    questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.innerHTML = `<p>${question}</p><textarea id="response${index+1}" rows="3" cols="50"></textarea>`;
        container.appendChild(questionElement);
    });
};

function submitResponses() {
    const storySummary = sessionStorage.getItem('storySummary');
    const responses = [];
    for (let i = 0; i < 5; i++) {
        responses.push(document.getElementById(`response${i+1}`).value);
    }

    fetch('https://legacy-voices-backend.onrender.com/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storySummary, responses })
    })
    .then(response => response.json())
    .then(data => {
        if (data.finalStory) {
            sessionStorage.setItem('finalStory', data.finalStory);
            window.location.href = 'review.html';
        } else {
            alert('Failed to generate final story');
        }
    })
    .catch(err => console.error('Error contacting backend:', err));
}