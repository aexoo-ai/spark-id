"use strict";
/**
 * Type definitions for Spark-ID
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONFIG = void 0;
// Default configuration
exports.DEFAULT_CONFIG = {
    // Core generation
    alphabet: 'yvndrfg9ejkmcpqxwt2uwxsza345h769', // Z-Base32 (URL-safe, no similar chars)
    entropyBits: 72, // 9 bytes = 72 bits (good balance of security/size)
    length: undefined, // Let it be calculated from entropyBits
    // Formatting
    maxPrefixLength: 20, // Reasonable limit for prefixes
    separator: '_', // Standard underscore separator
    case: 'upper', // Human-readable, consistent
    // Advanced
    encoding: 'base32', // Z-Base32 encoding
    timestamp: false, // Keep IDs stateless by default
    machineId: undefined, // No machine ID by default
};
//# sourceMappingURL=types.js.map