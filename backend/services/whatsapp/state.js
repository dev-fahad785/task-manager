export const registeredUsers = new Set();
export const userAttempts = new Map(); // Track failed attempts per user
export const pendingConfirmations = new Set(); // Store users who requested logout
export const waitingForTaskInput = new Set(); // Track users waiting to input tasks

export const MAX_ATTEMPTS = 3;
export const BLOCK_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
