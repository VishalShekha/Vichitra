async function fetchPasswords() {
    const response = await fetch('/get-passwords');
    const passwords = await response.json();
    const passwordList = document.getElementById('passwordList');
    passwordList.innerHTML = '';
    passwords.forEach((item, index) => {
        const btn = document.createElement('button');
        btn.textContent = `${item.URL}`;
        btn.addEventListener('mousedown', () => handleLongPressStart(index));
        btn.addEventListener('mouseup', handleLongPressEnd);
        btn.addEventListener('mouseleave', handleLongPressEnd);
        btn.addEventListener('touchstart', () => handleLongPressStart(index));
        btn.addEventListener('click',() => handleButtonClick(index));
        btn.addEventListener('touchend', handleLongPressEnd);
        passwordList.appendChild(btn);
    });
}

let longPressTimer;

function handleButtonClick(index) {
    const pinDialog = document.getElementById('pin-dialog');
    pinDialog.style.display = 'block';

    document.getElementById('pin-submit').onclick = () => {
        const pin1 = document.getElementById('pin-input-1').value;
        const pin2 = document.getElementById('pin-input-2').value;
        const pin3 = document.getElementById('pin-input-3').value;
        const pin4 = document.getElementById('pin-input-4').value;

        const pin = pin1 + pin2 + pin3 + pin4;
        
        if (pin.length === 4 && pin == 1234 ) {
            pinDialog.style.display = 'none';
            clearPinInputs();
            onClick(index)
        } else {
            alert('Please enter a valid 4-digit PIN.');
        }
    };

    document.getElementById('pin-cancel').onclick = () => {
        pinDialog.style.display = 'none';
        clearPinInputs();
    };
}

function clearPinInputs() {
    document.getElementById('pin-input-1').value = '';
    document.getElementById('pin-input-2').value = '';
    document.getElementById('pin-input-3').value = '';
    document.getElementById('pin-input-4').value = '';
}


function handleLongPressStart(index) {
    longPressTimer = setTimeout(() => {
        if (confirm('Do you want to delete this password?')) {
            deletePassword(index);
        }
    }, 2000); // Long press duration in milliseconds (e.g., 2 seconds)
}

async function onClick(index) {
    try {
        const response = await fetch('/get-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ index })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const passwords = await response.json();
        document.getElementById('url-shown').textContent = passwords.URL;
        document.getElementById('username-shown').textContent = passwords.username;
        document.getElementById('password-shown').textContent = passwords.password;

    } catch (error) {
        console.error('Error fetching password:', error);
        alert('Error fetching password, please try again later.');
    }
}


function handleLongPressEnd() {
    clearTimeout(longPressTimer);
}

async function deletePassword(index) {
    const response = await fetch('/delete-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ index })
    });

    const messageElement = document.getElementById('del-message');
    if (response.ok) {
        messageElement.textContent = 'Password deleted successfully!';
        messageElement.style.color = 'green';
        fetchPasswords();
    } else {
        messageElement.textContent = 'Failed to delete password.';
        messageElement.style.color = 'red';
    }

    setTimeout(() => {
        messageElement.textContent = '';
    }, 2000);
}

document.getElementById('passwordForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const URL = document.getElementById('URL').value;

    const response = await fetch('/save-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, URL })
    });

    const messageElement = document.getElementById('message');
    if (response.ok) {
        messageElement.textContent = 'Password saved successfully!';
        messageElement.style.color = 'green';
        fetchPasswords();
    } else {
        messageElement.textContent = 'Failed to save password.';
        messageElement.style.color = 'red';
    }

    setTimeout(() => {
        messageElement.textContent = ''; // Clear the message
    }, 2000);
});

// Function to copy button text to clipboard
function copyToClipboard(buttonId) {
    const button = document.getElementById(buttonId);
    const messageElement = document.getElementById('copy-message');
    const text = button.textContent;

    navigator.clipboard.writeText(text).then(() => {
        messageElement.textContent = 'Copied!';
        messageElement.style.color = 'green';
    }).catch(err => {
        messageElement.textContent = 'Err!';
        messageElement.style.color = 'red';
    });

    setTimeout(() => {
        messageElement.textContent = ''; // Clear the message
    }, 2000);
}

// Adding event listeners to copy text on button click
document.getElementById('url-shown').addEventListener('click', () => copyToClipboard('url-shown'));
document.getElementById('username-shown').addEventListener('click', () => copyToClipboard('username-shown'));
document.getElementById('password-shown').addEventListener('click', () => copyToClipboard('password-shown'));

// Fetch passwords on page load
fetchPasswords();
