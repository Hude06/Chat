async function encryptData(publicKeyBase64, tempData) {
    // console.log("Encrypting daat is",base64ToArrayBuffer(publicKeyBase64))
    const publicKeyBuffer = base64ToArrayBuffer(publicKeyBase64); // Convert base64 to ArrayBuffer
    const publicKey = await importPublicKey(publicKeyBuffer); // Import the key properly
    const encodedData = new TextEncoder().encode(tempData); // Encode the data
    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
        },
        publicKey, // The public key
        encodedData // Data to encrypt
    );

    return encryptedData; // Return the encrypted data
}
async function decryptData(privateKeyBase64, encryptedMessage) {
    try {
        const privateKeyBuffer = base64ToArrayBuffer(privateKeyBase64);
        console.log("Private Key Buffer:", privateKeyBuffer);

        const privateKey = await window.crypto.subtle.importKey(
            "pkcs8",
            privateKeyBuffer,
            {
                name: "RSA-OAEP",
                hash: "SHA-256",
            },
            true,
            ["decrypt"]
        );

        console.log("Imported Private Key:", privateKey);

        if (!(encryptedMessage instanceof ArrayBuffer)) {
            throw new TypeError("encryptedMessage must be an ArrayBuffer");
        }

        console.log("Encrypted message ArrayBuffer size:", encryptedMessage.byteLength);

        const decryptedMessage = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP",
            },
            privateKey,
            encryptedMessage
        );

        console.log("Decrypted message buffer:", decryptedMessage);
        return new TextDecoder().decode(decryptedMessage);
    } catch (error) {
        console.error("Decryption failed:", error);
        throw new Error("Decryption failed: " + error.message);
    }
}
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
function base64ToArrayBuffer(base64) {
    console.log("Base 64 is ", base64)
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}
async function importPublicKey(publicKeyBuffer) {
    return await window.crypto.subtle.importKey(
        "spki",
        publicKeyBuffer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        ["encrypt"]
    );
}
async function exportKey(key, format,pub) {
    try {
        if (pub) {
                const exportedKey = await window.crypto.subtle.exportKey("spki", key);
                // console.log("WORKED Pub")
                return exportedKey
        } else {
                const exportedKey = await window.crypto.subtle.exportKey("pkcs8", key);
                return exportedKey
        }
    } catch (error) {
        console.error("Key export failed:", error);
        throw new Error("Failed to export the key.");
    }
}
async function generateKeyPair() {
    const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048, // Length of the key in bits
            publicExponent: new Uint8Array([1, 0, 1]), // Commonly used exponent
            hash: "SHA-256", // Hash function
        },
        true, // Whether the key is extractable
        ["encrypt", "decrypt"] // Usages
    );

    return { publicKey, privateKey };
}
const { publicKey, privateKey } = await generateKeyPair();
const exportedPublicKey = await exportKey(publicKey, "spki", true);
const exportedPrivateKey = await exportKey(privateKey, "pkcs8", false);

const exportedPublicKeyBase64 = arrayBufferToBase64(exportedPublicKey);
const exportedPrivateKeyBase64 = arrayBufferToBase64(exportedPrivateKey);

console.log("Public Key Base64:", exportedPublicKeyBase64);
console.log("Private Key Base64:", exportedPrivateKeyBase64);

const encryptedData = await encryptData(exportedPublicKeyBase64, "Hello, World!");
console.log("Encrypted Data:", encryptedData);

const decryptedData = await decryptData(exportedPrivateKeyBase64, encryptedData);
console.log("Decrypted Data:", decryptedData);
