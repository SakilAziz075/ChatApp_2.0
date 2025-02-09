import { ec as EC } from "elliptic";

const ec = new EC("secp256k1");
// Convert hex to Uint8Array
const hexToBytes = (hex) =>
    new Uint8Array(hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

// Convert Uint8Array to hex
const bytesToHex = (bytes) =>
    [...new Uint8Array(bytes)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

// 1. Generate a Deterministic Private Key (PBKDF2 with SHA-256)
export async function generatePrivateKey(email, password) {
    const encoder = new TextEncoder();

    // Normalize email (lowercase) to avoid case sensitivity issues
    const normalizedEmail = email.trim().toLowerCase();

    // Import the key material from the user's email + password
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password), // Only password is used as key material
        { name: "PBKDF2" },
        false,
        ["deriveBits"]
    );

    // Derive a key using PBKDF2 with the email as the salt
    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: encoder.encode(normalizedEmail), // Email as salt
            iterations: 200000, // Higher iterations for security
            hash: "SHA-256",
        },
        keyMaterial,
        256
    );

    return bytesToHex(derivedBits).slice(0, 64); // Private key (256-bit hex)
}

//  2. Generate an ECDH Public Key from the Private Key
export function generateECDHPublicKey(privateKeyHex) {
    const keyPair = ec.keyFromPrivate(privateKeyHex, "hex");
    return keyPair.getPublic("hex"); // Public Key in Hex
}

// 3. Compute Shared Secret (ECDH)
export function computeSharedSecret(privateKeyHex, recipientPublicKeyHex) {
    const myKey = ec.keyFromPrivate(privateKeyHex, "hex");
    const recipientKey = ec.keyFromPublic(recipientPublicKeyHex, "hex");
    const sharedSecret = myKey.derive(recipientKey.getPublic()); // Shared Secret
    return sharedSecret.toString(16);
}

// 4. Encrypt Message (AES-GCM)
export async function encryptMessage(message, sharedSecretHex) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        hexToBytes(sharedSecretHex),
        { name: "AES-GCM" },
        false,
        ["encrypt"]
    );

    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        keyMaterial,
        new TextEncoder().encode(message)
    );

    return {
        iv: bytesToHex(iv),
        encryptedData: bytesToHex(encrypted),
    };
}

//  5. Decrypt Message (AES-GCM)
export async function decryptMessage(encryptedData, ivHex, sharedSecretHex) {
    const iv = hexToBytes(ivHex);
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        hexToBytes(sharedSecretHex),
        { name: "AES-GCM" },
        false,
        ["decrypt"]
    );

    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        keyMaterial,
        hexToBytes(encryptedData)
    );

    return new TextDecoder().decode(decrypted);
}
