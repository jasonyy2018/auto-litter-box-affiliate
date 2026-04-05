import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

function getKey(): Buffer {
    const key = process.env.ENCRYPTION_KEY;
    if (key && key.length >= 32) {
        return Buffer.from(key.slice(0, 32), 'utf8');
    }
    // Fallback: derive key from ADMIN_PASSWORD
    const fallback = process.env.ADMIN_PASSWORD || 'default-encryption-key-change-me!';
    return crypto.scryptSync(fallback, 'autolitter-salt', 32);
}

/**
 * Encrypt a plaintext string using AES-256-GCM
 * Returns: iv:authTag:ciphertext (all hex encoded)
 */
export function encrypt(text: string): string {
    const key = getKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt a string encrypted by the encrypt function
 */
export function decrypt(encryptedText: string): string {
    const key = getKey();
    const parts = encryptedText.split(':');

    if (parts.length !== 3) {
        throw new Error('Invalid encrypted text format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const ciphertext = parts[2];

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

/**
 * Mask a secret string for display (show first 4 and last 4 chars)
 */
export function maskSecret(secret: string): string {
    if (secret.length <= 8) return '••••••••';
    return `${secret.slice(0, 4)}${'•'.repeat(Math.min(secret.length - 8, 20))}${secret.slice(-4)}`;
}
