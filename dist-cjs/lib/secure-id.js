"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUnique = exports.generateMultiple = exports.validateId = exports.generateIdSafe = exports.parseId = exports.isValidId = exports.createId = exports.generateId = exports.SecureId = exports.InvalidIdError = exports.InvalidPrefixError = exports.SparkIdError = void 0;
const crypto_1 = require("crypto");
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
// Custom error classes for better error handling
class SparkIdError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = 'SparkIdError';
    }
}
exports.SparkIdError = SparkIdError;
class InvalidPrefixError extends SparkIdError {
    constructor(prefix) {
        super(`Invalid prefix: "${prefix}". Prefix must contain only alphanumeric characters and underscores, and be between 1-50 characters.`, 'INVALID_PREFIX');
        this.name = 'InvalidPrefixError';
    }
}
exports.InvalidPrefixError = InvalidPrefixError;
class InvalidIdError extends SparkIdError {
    constructor(id, reason) {
        super(`Invalid ID: "${id}". ${reason || 'ID format is not valid.'}`, 'INVALID_ID');
        this.name = 'InvalidIdError';
    }
}
exports.InvalidIdError = InvalidIdError;
class SecureId {
    constructor(id, prefix) {
        // Validate prefix if provided
        if (prefix !== undefined && !SecureId.isValidPrefix(prefix)) {
            throw new InvalidPrefixError(prefix);
        }
        // Convert prefix to uppercase for consistency
        const upperPrefix = prefix ? prefix.toUpperCase() : undefined;
        this.id = id || SecureId.generateRaw();
        this.prefix = upperPrefix;
        this.full = upperPrefix
            ? `${upperPrefix}${SecureId.PREFIX_SEPARATOR}${this.id}`
            : this.id;
    }
    /**
     * Validate prefix format
     */
    static isValidPrefix(prefix) {
        if (typeof prefix !== 'string' ||
            prefix.length === 0 ||
            prefix.length > this.MAX_PREFIX_LENGTH) {
            return false;
        }
        // Only allow alphanumeric characters and underscores
        return this.PREFIX_REGEX.test(prefix);
    }
    /**
     * Generate a new raw ID (without prefix)
     */
    static generateRaw() {
        const bytes = (0, crypto_1.randomBytes)(SecureId.BYTES_LENGTH);
        return SecureId.base32Encode(bytes);
    }
    /**
     * Generate a new ID with optional prefix
     */
    static generate(prefix) {
        if (prefix !== undefined && !SecureId.isValidPrefix(prefix)) {
            throw new InvalidPrefixError(prefix);
        }
        const rawId = SecureId.generateRaw();
        // Convert prefix to uppercase for consistency
        const upperPrefix = prefix ? prefix.toUpperCase() : undefined;
        return upperPrefix
            ? `${upperPrefix}${SecureId.PREFIX_SEPARATOR}${rawId}`
            : rawId;
    }
    /**
     * Create a new SecureId instance
     */
    static create(prefix) {
        return new SecureId(undefined, prefix);
    }
    /**
     * Parse an ID string into components
     */
    static parse(idString) {
        if (typeof idString !== 'string') {
            throw new InvalidIdError(idString, 'ID must be a string');
        }
        if (idString.length === 0) {
            throw new InvalidIdError(idString, 'ID cannot be empty');
        }
        const parts = idString.split(SecureId.PREFIX_SEPARATOR);
        if (parts.length === 1) {
            const id = parts[0];
            if (!SecureId.isValidRawId(id)) {
                throw new InvalidIdError(idString, 'Invalid ID format');
            }
            return { id, full: id };
        }
        if (parts.length === 2) {
            const prefix = parts[0];
            const id = parts[1];
            if (!SecureId.isValidRawId(id)) {
                throw new InvalidIdError(idString, 'Invalid ID format');
            }
            return { prefix, id, full: idString };
        }
        throw new InvalidIdError(idString, 'ID contains too many separators');
    }
    /**
     * Validate if a string is a valid ID
     */
    static isValid(idString) {
        try {
            const parsed = SecureId.parse(idString);
            return SecureId.isValidRawId(parsed.id);
        }
        catch {
            return false;
        }
    }
    /**
     * Validate if a raw ID (without prefix) is valid
     */
    static isValidRawId(rawId) {
        if (!rawId || typeof rawId !== 'string')
            return false;
        // Performance optimization: check length first
        // 9 bytes = 72 bits, Base32 encoding: 72/5 = 14.4, so 12-15 characters is correct
        // Actual generated IDs are 15 characters
        if (rawId.length < 12 || rawId.length > 15)
            return false;
        return rawId
            .split('')
            .every((char) => SecureId.Z_BASE32_ALPHABET.includes(char.toLowerCase()));
    }
    static base32Encode(buffer) {
        let value = 0;
        let bits = 0;
        let result = '';
        for (let i = 0; i < buffer.length; i++) {
            value = (value << 8) | buffer[i];
            bits += 8;
            while (bits >= 5) {
                result += SecureId.Z_BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
                bits -= 5;
            }
        }
        if (bits > 0) {
            result += SecureId.Z_BASE32_ALPHABET[(value << (5 - bits)) & 31];
        }
        // Convert to uppercase for better human readability
        return result.toUpperCase();
    }
    toString() {
        return this.full;
    }
    equals(other) {
        const otherId = typeof other === 'string' ? other : other.full;
        return this.full === otherId;
    }
    /**
     * Get the entropy bits of this ID
     */
    getEntropyBits() {
        return SecureId.BYTES_LENGTH * 8;
    }
    /**
     * Check if this ID has a prefix
     */
    hasPrefix() {
        return this.prefix !== undefined;
    }
    /**
     * Get statistics about this ID
     */
    getStats() {
        const entropyBits = this.getEntropyBits();
        const maxIds = Math.pow(2, entropyBits);
        const collisionProbability = 1 / maxIds;
        return {
            entropyBits,
            collisionProbability,
            maxIds
        };
    }
    /**
     * Validate this ID and return detailed result
     */
    validate() {
        try {
            const isValid = SecureId.isValid(this.full);
            return {
                isValid,
                error: isValid ? undefined : 'Invalid ID format',
                code: isValid ? undefined : 'INVALID_FORMAT'
            };
        }
        catch (error) {
            return {
                isValid: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                code: 'VALIDATION_ERROR'
            };
        }
    }
    /**
     * Create a new ID with the same prefix
     */
    generateSimilar() {
        return new SecureId(undefined, this.prefix);
    }
    /**
     * Convert to JSON representation
     */
    toJSON() {
        return {
            id: this.id,
            prefix: this.prefix,
            full: this.full
        };
    }
}
exports.SecureId = SecureId;
SecureId.Z_BASE32_ALPHABET = 'yvndrfg9ejkmcpqxwt2uwxsza345h769';
SecureId.BYTES_LENGTH = 9;
SecureId.PREFIX_SEPARATOR = '_';
SecureId.MAX_PREFIX_LENGTH = 50; // Prevent extremely long prefixes
SecureId.PREFIX_REGEX = /^[a-zA-Z0-9_]+$/;
// Convenience functions
const generateId = (prefix) => SecureId.generate(prefix);
exports.generateId = generateId;
const createId = (prefix) => SecureId.create(prefix);
exports.createId = createId;
const isValidId = (id) => SecureId.isValid(id);
exports.isValidId = isValidId;
const parseId = (id) => SecureId.parse(id);
exports.parseId = parseId;
// Enhanced convenience functions with better error handling
const generateIdSafe = (prefix) => {
    try {
        const id = SecureId.generate(prefix);
        return { success: true, id };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};
exports.generateIdSafe = generateIdSafe;
const validateId = (id) => {
    try {
        const isValid = SecureId.isValid(id);
        return {
            isValid,
            error: isValid ? undefined : 'Invalid ID format',
            code: isValid ? undefined : 'INVALID_FORMAT'
        };
    }
    catch (error) {
        return {
            isValid: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            code: 'VALIDATION_ERROR'
        };
    }
};
exports.validateId = validateId;
const generateMultiple = (count, prefix) => {
    if (count <= 0) {
        throw new SparkIdError('Count must be greater than 0', 'INVALID_COUNT');
    }
    if (count > 1000) {
        throw new SparkIdError('Count cannot exceed 1000', 'COUNT_TOO_LARGE');
    }
    return Array.from({ length: count }, () => SecureId.generate(prefix));
};
exports.generateMultiple = generateMultiple;
const generateUnique = (count, prefix) => {
    const ids = new Set();
    let attempts = 0;
    const maxAttempts = count * 10; // Prevent infinite loops
    while (ids.size < count && attempts < maxAttempts) {
        ids.add(SecureId.generate(prefix));
        attempts++;
    }
    if (ids.size < count) {
        throw new SparkIdError(`Failed to generate ${count} unique IDs after ${maxAttempts} attempts`, 'GENERATION_FAILED');
    }
    return ids;
};
exports.generateUnique = generateUnique;
//# sourceMappingURL=secure-id.js.map