// Re-export everything from the main module
export * from './lib/secure-id.js';

// Add the sparkId alias for better naming consistency
import { generateId } from './lib/secure-id.js';
export const sparkId = generateId;

// Default export for CommonJS compatibility
import {
  SecureId,
  createId,
  generateId as genId,
  isValidId,
  parseId,
} from './lib/secure-id.js';
export default {
  generateId: genId,
  createId,
  isValidId,
  parseId,
  sparkId: genId,
  SecureId,
};
