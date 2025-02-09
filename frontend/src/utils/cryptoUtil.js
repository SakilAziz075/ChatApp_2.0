import CryptoJS from "crypto-js";
import elliptic from "elliptic";
const { ec: EC } = elliptic;

// Initialize Elliptic Curve (secp256k1)
const ec = new EC("secp256k1");

// Convert hex to Uint8Array
const hexToBytes = (hex) =>
    new Uint8Array(hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

// Convert Uint8Array to hex
const bytesToHex = (bytes) =>
    [...new Uint8Array(bytes)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

// 1. Generate Private Key using PBKDF2 (CryptoJS)
export function generatePrivateKey(email, password) {
    const normalizedEmail = email.trim().toLowerCase();

    // Derive a key using PBKDF2 with the email as the salt
    const derivedKey = CryptoJS.PBKDF2(password, normalizedEmail, {
        keySize: 256 / 32, // 256-bit key
        iterations: 200000, // Higher iterations for security
        hasher: CryptoJS.algo.SHA256,
    });

    return derivedKey.toString(CryptoJS.enc.Hex).slice(0, 64); // Private key (256-bit hex)
}

// 2. Generate ECDH Public Key from the Private Key (CryptoJS with Elliptic Curve)
export function generateECDHPublicKey(privateKeyHex) {
    const keyPair = ec.keyFromPrivate(privateKeyHex, "hex");
    return keyPair.getPublic(false, "hex"); // Public Key in Hex
}

// 3. Compute Shared Secret (ECDH) (using Elliptic Curve and CryptoJS)
export function computeSharedSecret(privateKeyHex, recipientPublicKeyHex) {
    const myKey = ec.keyFromPrivate(privateKeyHex, "hex");
    const recipientKey = ec.keyFromPublic(recipientPublicKeyHex, "hex");
    const sharedSecret = myKey.derive(recipientKey.getPublic()); // Shared Secret

    // Return the shared secret in hex format with consistent padding (64 chars)
    return sharedSecret.toString(16).padStart(64, "0");
}

// 4. Encrypt Message (AES-CBC)
export function encryptMessage(message, sharedSecretHex) {
    const iv = CryptoJS.lib.WordArray.random(12); // 12 bytes for the IV (Initialization Vector)

    // Create a key from the shared secret
    const key = CryptoJS.enc.Hex.parse(sharedSecretHex);

    // Encrypt the message using AES (CBC mode with PKCS7 padding)
    const encrypted = CryptoJS.AES.encrypt(message, key, { iv: iv });

    // Return the IV and the encrypted data as hex
    return {
        iv: iv.toString(CryptoJS.enc.Hex),
        encryptedData: encrypted.ciphertext.toString(CryptoJS.enc.Hex),
    };
}

// 5. Decrypt Message (AES-CBC)
export function decryptMessage(encryptedData, ivHex, sharedSecretHex) {
    const iv = CryptoJS.enc.Hex.parse(ivHex); // Convert IV to WordArray
    const key = CryptoJS.enc.Hex.parse(sharedSecretHex); // Convert shared secret to WordArray

    // Decrypt the message using AES (CBC mode with PKCS7 padding)
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Hex.parse(encryptedData) },
        key,
        { iv: iv }
    );

    // Return the decrypted message
    return decrypted.toString(CryptoJS.enc.Utf8);
}
