export * from './lib/secure-id.js';
export * from './types.js';

// Re-export sparkId for convenience
import { generateId } from './lib/secure-id.js';
export const sparkId = generateId;
