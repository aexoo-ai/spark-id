/**
 * Type definitions for Spark-ID
 */

export interface ParsedId {
    prefix?: string;
    id: string;
    full: string;
}

export interface SparkIdConfig {
    // Core generation
    alphabet?: string;
    entropyBits?: number;
    length?: number;

    // Formatting
    maxPrefixLength?: number;
    separator?: string;
    case?: 'upper' | 'lower' | 'mixed';

    // Advanced
    encoding?: 'base32' | 'base64' | 'hex' | 'custom';
    timestamp?: boolean;
    machineId?: string | number;
}

export interface SparkIdOptions {
    prefix?: string;
    config?: Partial<SparkIdConfig>;
}

export interface SparkIdValidationResult {
    isValid: boolean;
    error?: string;
    code?: string;
}

export interface SparkIdStats {
    entropyBits: number;
    collisionProbability: number;
    maxIds: number;
}

// Default configuration
export const DEFAULT_CONFIG: SparkIdConfig = {
    // Core generation
    alphabet: 'yvndrfg9ejkmcpqxwt2uwxsza345h769', // Z-Base32 (URL-safe, no similar chars)
    entropyBits: 72,            // 9 bytes = 72 bits (good balance of security/size)
    length: undefined,          // Let it be calculated from entropyBits

    // Formatting
    maxPrefixLength: 20,        // Reasonable limit for prefixes
    separator: '_',             // Standard underscore separator
    case: 'upper',              // Human-readable, consistent

    // Advanced
    encoding: 'base32',         // Z-Base32 encoding
    timestamp: false,           // Keep IDs stateless by default
    machineId: undefined,       // No machine ID by default
};

// Re-export types from the main module
export type { InvalidIdError, InvalidPrefixError, SecureId, SparkIdError } from './lib/secure-id.js';

