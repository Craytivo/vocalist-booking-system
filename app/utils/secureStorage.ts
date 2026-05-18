import { encrypt, decrypt, SENSITIVE_FIELDS } from "./encryption";

interface SecureStorageOptions {
  encryptSensitive?: boolean;
  warnOnFirstUse?: boolean;
}

const STORAGE_WARNING_KEY = "setlist-storage-warning-acknowledged";

export class SecureStorage {
  private encryptSensitive: boolean;
  private warnOnFirstUse: boolean;

  constructor(options: SecureStorageOptions = {}) {
    this.encryptSensitive = options.encryptSensitive ?? true;
    this.warnOnFirstUse = options.warnOnFirstUse ?? true;
  }

  async setItem(key: string, value: any): Promise<void> {
    try {
      const data = JSON.stringify(value);
      
      if (this.encryptSensitive) {
        const encrypted = await encrypt(data);
        localStorage.setItem(key, encrypted);
      } else {
        localStorage.setItem(key, data);
      }

      // Show warning on first use of localStorage for sensitive data
      if (this.warnOnFirstUse && this.isSensitiveKey(key) && !this.hasAcknowledgedWarning()) {
        this.showStorageWarning();
      }
    } catch (e) {
      console.error("Failed to set item in secure storage:", e);
      // Fallback to plain localStorage
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  async getItem(key: string): Promise<any> {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      if (this.encryptSensitive) {
        const decrypted = await decrypt(stored);
        return JSON.parse(decrypted);
      } else {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to get item from secure storage:", e);
      // Fallback to plain localStorage
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      try {
        return JSON.parse(stored);
      } catch {
        return stored;
      }
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  private isSensitiveKey(key: string): boolean {
    const sensitiveKeys = [
      "offlineDraft",
      "contractTemplates",
      "contractData",
    ];
    return sensitiveKeys.some(sk => key.includes(sk));
  }

  private hasAcknowledgedWarning(): boolean {
    return localStorage.getItem(STORAGE_WARNING_KEY) === "true";
  }

  private showStorageWarning(): void {
    // This can be used to show a warning banner in the UI
    // For now, we'll just set a flag that the UI can check
    localStorage.setItem(STORAGE_WARNING_KEY, "true");
  }

  static acknowledgeWarning(): void {
    localStorage.setItem(STORAGE_WARNING_KEY, "true");
  }

  static shouldShowWarning(): boolean {
    return localStorage.getItem(STORAGE_WARNING_KEY) !== "true";
  }

  static clearSensitiveData(): void {
    // Clear all sensitive data from localStorage
    const sensitiveKeys = [
      "offlineDraft",
      "offlineDraftTimestamp",
      "contractTemplates",
    ];
    sensitiveKeys.forEach(key => localStorage.removeItem(key));
  }
}

// Singleton instance
export const secureStorage = new SecureStorage({
  encryptSensitive: true,
  warnOnFirstUse: true,
});
