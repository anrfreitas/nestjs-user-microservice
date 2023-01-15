import crypto from 'crypto';
import globalSettings from '../config';

// Defining secret
const secret = globalSettings.ENCRYPTION_KEY(); // Must be 32 characters

// Defining iv
const iv = globalSettings.ENCRYPTION_IV(); // Must be 16 characters

// Defining algorithm
const algorithm = 'aes-256-cbc';

// Defining key
const key = crypto.createHash('sha256').update(String(secret)).digest('base64').slice(0, 32);

export function encrypt(value: string): string {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv));
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decrypt(value: string): string {
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv));
    let decrypted = decipher.update(value, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
