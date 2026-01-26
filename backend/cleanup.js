import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sessionDir = path.join(__dirname, '.wwebjs_auth', 'session');

const lockFiles = ['SingletonLock', 'SingletonCookie', 'SingletonSocket'];

function cleanupLocks() {
    if (!fs.existsSync(sessionDir)) {
        console.log('Session directory does not exist, skipping cleanup.');
        return;
    }

    console.log('Checking for stale lock files in:', sessionDir);

    try {
        const files = fs.readdirSync(sessionDir);
        files.forEach(file => {
            if (lockFiles.includes(file)) {
                const filePath = path.join(sessionDir, file);
                try {
                    fs.unlinkSync(filePath);
                    console.log(`Removed stale lock file: ${file}`);
                } catch (err) {
                    console.error(`Failed to remove ${file}:`, err.message);
                }
            }
        });
        console.log('Cleanup complete.');
    } catch (err) {
        console.error('Error during cleanup:', err.message);
    }
}

cleanupLocks();
