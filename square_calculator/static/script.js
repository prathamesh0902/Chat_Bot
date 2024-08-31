alert("JavaScript is working!");
function calculateSquare() {
    const number = document.getElementById('numberInput').value;
    fetch('/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: number })
    })
    .then(response => response.json())
    .then(data => {
        const responseElement = document.getElementById('response');
        if (data.result !== undefined) {
            responseElement.innerText = `The square is: ${data.result}`;
        } else {
            responseElement.innerText = 'Error: ' + data.error;
        }
    });
}
