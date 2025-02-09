// testCryptoUtils.js
// Make sure to run `npm install crypto-js elliptic` before executing this test file.
// Also ensure your package.json is configured for ES modules (e.g. "type": "module")
// or run node with the appropriate flags.

import {
    generatePrivateKey,
    generateECDHPublicKey,
    computeSharedSecret,
    encryptMessage,
    decryptMessage,
  } from "./cryptoUtil.js";
  
  // Simulate two users: Alice and Bob
  const aliceEmail = "sakil@example.com";
  const alicePassword = "1234";
  const bobEmail = "sanju@example.com";
  const bobPassword = "1234";
  
  // 1. Generate Private Keys for both users
  const alicePrivateKey = generatePrivateKey(aliceEmail, alicePassword);
  const bobPrivateKey = generatePrivateKey(bobEmail, bobPassword);
  
  console.log("Alice Private Key:", alicePrivateKey);
  console.log("Bob Private Key:  ", bobPrivateKey);
  
  // 2. Generate corresponding Public Keys
  const alicePublicKey = generateECDHPublicKey(alicePrivateKey);
  const bobPublicKey = generateECDHPublicKey(bobPrivateKey);
  
  console.log("Alice Public Key:", alicePublicKey);
  console.log("Bob Public Key:  ", bobPublicKey);
  
  // 3. Compute the shared secret from each side
  const aliceSharedSecret = computeSharedSecret(alicePrivateKey, bobPublicKey);
  const bobSharedSecret = computeSharedSecret(bobPrivateKey, alicePublicKey);
  
  console.log("Alice Shared Secret:", aliceSharedSecret);
  console.log("Bob Shared Secret:  ", bobSharedSecret);
  
  // Verify that both shared secrets match
  if (aliceSharedSecret === bobSharedSecret) {
    console.log("✅ Shared secrets match!");
  } else {
    console.error("❌ Shared secrets do not match!");
  }
  
  // 4. Encrypt a message using the shared secret (Alice encrypts)
  const message = "Hello Bob, this is a secret message from Alice!";
  const encryptionResult = encryptMessage(message, aliceSharedSecret);
  
  console.log("Encryption IV:", encryptionResult.iv);
  console.log("Encrypted Data:", encryptionResult.encryptedData);
  
  // 5. Bob decrypts the message using his computed shared secret
  const decryptedMessage = decryptMessage(
    encryptionResult.encryptedData,
    encryptionResult.iv,
    bobSharedSecret
  );
  
  console.log("Decrypted Message:", decryptedMessage);
  
  // Verify that the decrypted message matches the original
  if (decryptedMessage === message) {
    console.log("✅ Encryption/Decryption successful!");
  } else {
    console.error("❌ Decrypted message does not match the original.");
  }
  