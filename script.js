// Global variable to store start time
let startTime;

// Encryption function
function encryptText() {
    startTime = performance.now(); // Capture start time

    try {
        const passphrase = document.getElementById('passphrase').value;
        const text = document.getElementById('inputText').value;
        const keySize = parseInt(document.getElementById('keyStrength').value);
        const encryptedText = CryptoJS.AES.encrypt(text, passphrase, { keySize: keySize / 32 }).toString();
        const base64Encrypted = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encryptedText));
        document.getElementById('output').value = base64Encrypted;
        setAutoDeleteTimer();

        // Generate QR code
        generateQRCode(base64Encrypted);

        displayPerformanceMetrics(); // Display the time taken
    } catch (error) {
        document.getElementById('output').value = 'Error encrypting text.';
    }
}

// Decryption function
function decryptText() {
    startTime = performance.now(); // Capture start time

    try {
        const passphrase = document.getElementById('passphrase').value;
        const base64EncryptedText = document.getElementById('inputText').value;
        const encryptedText = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(base64EncryptedText));
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedText, passphrase);
        const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
        document.getElementById('output').value = decryptedText;
        setAutoDeleteTimer();

        displayPerformanceMetrics(); // Display the time taken
    } catch (error) {
        document.getElementById('output').value = 'Error decrypting text. Ensure correct passphrase and input.';
    }
}

// Function to display performance metrics
function displayPerformanceMetrics() {
    const endTime = performance.now(); // Capture end time
    const duration = endTime - startTime;
    const metricsElement = document.getElementById('performanceMetrics');
    metricsElement.textContent = `Time taken: ${duration.toFixed(2)} milliseconds`;
}

// Copy function
function copyToClipboard() {
    const output = document.getElementById('output');
    output.select();
    document.execCommand('copy');
}

// Hover effect to temporarily reveal the passphrase
const passphraseInput = document.getElementById('passphrase');
const passphraseDisplay = document.getElementById('passphrase-display');

passphraseInput.addEventListener('mouseenter', () => {
    passphraseDisplay.textContent = passphraseInput.value;
    passphraseDisplay.style.display = 'inline-block';
});

passphraseInput.addEventListener('mouseleave', () => {
    passphraseDisplay.textContent = '';
    passphraseDisplay.style.display = 'none';
});

// Set auto-delete timer
let clearTimer;
function setAutoDeleteTimer() {
    const duration = parseInt(document.getElementById('autoDelete').value);
    if (clearTimer) clearTimeout(clearTimer);
    if (duration > 0) {
        clearTimer = setTimeout(() => {
            document.getElementById('output').value = '';
        }, duration * 60 * 1000);
    }
}

document.getElementById('autoDelete').addEventListener('change', setAutoDeleteTimer);

// Function to generate QR code
function generateQRCode(text) {
    const qrcodeContainer = document.getElementById('qrcode-container');
    qrcodeContainer.innerHTML = ''; // Clear previous QR codes

    const qrcode = new QRCode(qrcodeContainer, {
        text: text,
        width: 128,
        height: 128,
    });
}
