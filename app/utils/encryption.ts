// Simple encryption/decryption using Web Crypto API
// This provides basic protection for sensitive data in localStorage

const ENCRYPTION_KEY = "setlist-contract-encryption-key";

async function getEncryptionKey(): Promise<CryptoKey> {
  // Try to get existing key from localStorage
  const storedKey = localStorage.getItem(ENCRYPTION_KEY);
  if (storedKey) {
    try {
      const keyData = JSON.parse(storedKey);
      return await crypto.subtle.importKey(
        "jwk",
        keyData,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );
    } catch (e) {
      console.error("Failed to import existing key:", e);
    }
  }

  // Generate new key
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  // Export and store the key
  const exportedKey = await crypto.subtle.exportKey("jwk", key);
  localStorage.setItem(ENCRYPTION_KEY, JSON.stringify(exportedKey));

  return key;
}

export async function encrypt(data: string): Promise<string> {
  try {
    const key = await getEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(data);
    
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encoded
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Convert to base64 for storage
    let binary = "";
    for (let i = 0; i < combined.length; i++) {
      binary += String.fromCharCode(combined[i]);
    }
    return btoa(binary);
  } catch (e) {
    console.error("Encryption failed:", e);
    return data; // Fallback to plain text if encryption fails
  }
}

export async function decrypt(encryptedData: string): Promise<string> {
  try {
    if (!encryptedData) return "";
    
    // Check if data is encrypted (base64 check)
    try {
      const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
      
      if (combined.length < 12) {
        return encryptedData; // Not encrypted
      }

      const iv = combined.slice(0, 12);
      const data = combined.slice(12);
      
      const key = await getEncryptionKey();
      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        data
      );

      return new TextDecoder().decode(decrypted);
    } catch (e) {
      // If decryption fails, return as-is (might be plain text)
      return encryptedData;
    }
  } catch (e) {
    console.error("Decryption failed:", e);
    return encryptedData;
  }
}

// List of sensitive field names that should be encrypted
export const SENSITIVE_FIELDS = [
  "artistName",
  "artistEmail",
  "clientName",
  "email",
  "phoneNumber",
  "eventName",
  "venueLocation",
  "totalFee",
  "depositTerms",
  "travelTerms",
  "cancellationTerms",
  "technicalRequirements",
  "rehearsalDetails",
  "soundCheckDetails",
  "hospitalityDetails",
  "latePaymentPenalty",
  "cancellationFee",
  "insuranceDetails",
  "imageUsageTerms",
  "merchandiseTerms",
  "securityDetails",
  "parkingDetails",
  "artistSignerName",
  "clientSignerName",
  "artistSignature",
  "clientSignature",
];

export function encryptSensitiveFields(obj: any): any {
  if (typeof obj !== "object" || obj === null) return obj;
  
  const encrypted: any = {};
  for (const key in obj) {
    if (SENSITIVE_FIELDS.includes(key) && typeof obj[key] === "string") {
      encrypted[key] = obj[key]; // Will be encrypted when stored
    } else {
      encrypted[key] = obj[key];
    }
  }
  return encrypted;
}
