import type { SparkIdConfig, SparkIdStats, SparkIdValidationResult } from '../types';
/**
 * Secure ID Generator with optional prefix support
 *
 * Features:
 * - Cryptographically secure (72 bits entropy)
 * - URL-safe Z-Base32 encoding
 * - Optional prefix support (e.g., "USER_", "TXN_")
 * - Collision-resistant
 * - Human-readable (all uppercase)
 * - Comprehensive error handling
 *
 * @example
 * ```typescript
 * // Basic usage
 * const id = generateId() // "YBNDRFG8EJKMCPQXOT1UWISZA345H769"
 *
 * // With prefix
 * const userId = generateId('USER') // "USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769"
 * const txnId = generateId('TXN') // "TXN_YBNDRFG8EJKMCPQXOT1UWISZA345H769"
 *
 * // Validation
 * isValidId('USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769') // true
 * isValidId('invalid-id') // false
 *
 * // Parsing
 * const parsed = parseId('USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769')
 * // { prefix: 'USER', id: 'YBNDRFG8EJKMCPQXOT1UWISZA345H769', full: 'USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769' }
 * ```
 */
export declare class SparkIdError extends Error {
    code?: string | undefined;
    constructor(message: string, code?: string | undefined);
}
export declare class InvalidPrefixError extends SparkIdError {
    constructor(prefix: string);
}
export declare class InvalidIdError extends SparkIdError {
    constructor(id: string, reason?: string);
}
export declare class SecureId {
    private static globalConfig;
    private static readonly Z_BASE32_ALPHABET;
    private static readonly BYTES_LENGTH;
    private static readonly PREFIX_SEPARATOR;
    private static readonly MAX_PREFIX_LENGTH;
    private static readonly PREFIX_REGEX;
    readonly id: string;
    readonly prefix?: string;
    readonly full: string;
    constructor(id?: string, prefix?: string, config?: Partial<SparkIdConfig>);
    /**
     * Validate prefix format
     */
    private static isValidPrefix;
    /**
     * Generate a new raw ID (without prefix)
     */
    static generateRaw(config?: Partial<SparkIdConfig>): string;
    /**
     * Generate a new ID with optional prefix and configuration
     */
    static generate(prefix?: string, config?: Partial<SparkIdConfig>): string;
    /**
     * Create a new SecureId instance
     */
    static create(prefix?: string, config?: Partial<SparkIdConfig>): SecureId;
    /**
     * Parse an ID string into components
     */
    static parse(idString: string, config?: Partial<SparkIdConfig>): {
        prefix?: string;
        id: string;
        full: string;
    };
    /**
     * Validate if a string is a valid ID
     */
    static isValid(idString: string, config?: Partial<SparkIdConfig>): boolean;
    /**
     * Validate if a raw ID (without prefix) is valid
     */
    static isValidRawId(rawId: string, config?: Partial<SparkIdConfig>): boolean;
    private static base32Encode;
    toString(): string;
    equals(other: SecureId | string): boolean;
    /**
     * Get the entropy bits of this ID
     */
    getEntropyBits(): number;
    /**
     * Check if this ID has a prefix
     */
    hasPrefix(): boolean;
    /**
     * Configure global settings
     */
    static configure(config: Partial<SparkIdConfig>): void;
    /**
     * Get current global configuration
     */
    static getConfig(): SparkIdConfig;
    /**
     * Reset configuration to defaults
     */
    static resetConfig(): void;
    /**
     * Get configuration value with fallback to defaults
     */
    private static getConfigValue;
    /**
     * Get statistics about this ID
     */
    getStats(): SparkIdStats;
    /**
     * Validate this ID and return detailed result
     */
    validate(): SparkIdValidationResult;
    /**
     * Create a new ID with the same prefix
     */
    generateSimilar(): SecureId;
    /**
     * Convert to JSON representation
     */
    toJSON(): {
        id: string;
        prefix?: string;
        full: string;
    };
}
export declare const generateId: (prefix?: string, config?: Partial<SparkIdConfig>) => string;
export declare const createId: (prefix?: string, config?: Partial<SparkIdConfig>) => SecureId;
export declare const isValidId: (id: string, config?: Partial<SparkIdConfig>) => boolean;
export declare const parseId: (id: string, config?: Partial<SparkIdConfig>) => {
    prefix?: string;
    id: string;
    full: string;
};
export declare const generateIdSafe: (prefix?: string, config?: Partial<SparkIdConfig>) => {
    success: true;
    id: string;
} | {
    success: false;
    error: string;
};
export declare const validateId: (id: string, config?: Partial<SparkIdConfig>) => SparkIdValidationResult;
export declare const generateMultiple: (count: number, prefix?: string, config?: Partial<SparkIdConfig>) => string[];
export declare const generateUnique: (count: number, prefix?: string, config?: Partial<SparkIdConfig>) => Set<string>;
export declare const configure: (config: Partial<SparkIdConfig>) => void;
export declare const getConfig: () => SparkIdConfig;
export declare const resetConfig: () => void;
//# sourceMappingURL=secure-id.d.ts.map