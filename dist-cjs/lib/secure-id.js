"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetConfig = exports.getConfig = exports.configure = exports.generateUnique = exports.generateMultiple = exports.validateId = exports.generateIdSafe = exports.parseId = exports.isValidId = exports.createId = exports.generateId = exports.SecureId = exports.InvalidIdError = exports.InvalidPrefixError = exports.SparkIdError = void 0;
const crypto_1 = require("crypto");
const types_js_1 = require("../types.js");
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
        super(`Invalid prefix: "${prefix}". Prefix must contain only alphanumeric characters and underscores, and be between 1-20 characters.`, 'INVALID_PREFIX');
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
    constructor(id, prefix, config) {
        // Validate prefix if provided
        if (prefix !== undefined && !SecureId.isValidPrefix(prefix, config)) {
            throw new InvalidPrefixError(prefix);
        }
        const separator = SecureId.getConfigValue('separator', config) ?? '_';
        const caseSetting = SecureId.getConfigValue('case', config) ?? 'upper';
        // Apply case setting to prefix
        let formattedPrefix;
        if (prefix) {
            switch (caseSetting) {
                case 'lower':
                    formattedPrefix = prefix.toLowerCase();
                    break;
                case 'upper':
                    formattedPrefix = prefix.toUpperCase();
                    break;
                case 'mixed':
                    formattedPrefix = prefix; // Keep as provided
                    break;
                default:
                    formattedPrefix = prefix.toUpperCase();
            }
        }
        this.id = id || SecureId.generateRaw(config);
        this.prefix = formattedPrefix;
        this.full = formattedPrefix
            ? `${formattedPrefix}${separator}${this.id}`
            : this.id;
    }
    /**
     * Validate prefix format
     */
    static isValidPrefix(prefix, config) {
        const maxPrefixLength = SecureId.getConfigValue('maxPrefixLength', config) ?? 20;
        if (typeof prefix !== 'string' ||
            prefix.length === 0 ||
            prefix.length > maxPrefixLength) {
            return false;
        }
        // Only allow alphanumeric characters and underscores
        return this.PREFIX_REGEX.test(prefix);
    }
    /**
     * Generate a new raw ID (without prefix)
     */
    static generateRaw(config) {
        const entropyBits = SecureId.getConfigValue('entropyBits', config) ?? 72;
        const alphabet = SecureId.getConfigValue('alphabet', config) ?? 'yvndrfg9ejkmcpqxwt2uwxsza345h769';
        const caseSetting = SecureId.getConfigValue('case', config) ?? 'upper';
        const bytesLength = Math.ceil(entropyBits / 8);
        const bytes = (0, crypto_1.randomBytes)(bytesLength);
        const encoded = SecureId.base32Encode(bytes, alphabet);
        // Apply case setting
        switch (caseSetting) {
            case 'lower':
                return encoded.toLowerCase();
            case 'upper':
                return encoded.toUpperCase();
            case 'mixed':
                return encoded; // Keep as generated
            default:
                return encoded.toUpperCase();
        }
    }
    /**
     * Generate a new ID with optional prefix and configuration
     */
    static generate(prefix, config) {
        if (prefix !== undefined && !SecureId.isValidPrefix(prefix, config)) {
            throw new InvalidPrefixError(prefix);
        }
        const rawId = SecureId.generateRaw(config);
        const separator = SecureId.getConfigValue('separator', config) ?? '_';
        const caseSetting = SecureId.getConfigValue('case', config) ?? 'upper';
        // Apply case setting to prefix
        let formattedPrefix;
        if (prefix) {
            switch (caseSetting) {
                case 'lower':
                    formattedPrefix = prefix.toLowerCase();
                    break;
                case 'upper':
                    formattedPrefix = prefix.toUpperCase();
                    break;
                case 'mixed':
                    formattedPrefix = prefix; // Keep as provided
                    break;
                default:
                    formattedPrefix = prefix.toUpperCase();
            }
        }
        return formattedPrefix
            ? `${formattedPrefix}${separator}${rawId}`
            : rawId;
    }
    /**
     * Create a new SecureId instance
     */
    static create(prefix, config) {
        return new SecureId(undefined, prefix, config);
    }
    /**
     * Parse an ID string into components
     */
    static parse(idString, config) {
        if (typeof idString !== 'string') {
            throw new InvalidIdError(idString, 'ID must be a string');
        }
        if (idString.length === 0) {
            throw new InvalidIdError(idString, 'ID cannot be empty');
        }
        const separator = SecureId.getConfigValue('separator', config) ?? '_';
        const parts = idString.split(separator);
        if (parts.length === 1) {
            const id = parts[0];
            if (!SecureId.isValidRawId(id, config)) {
                throw new InvalidIdError(idString, 'Invalid ID format');
            }
            return { id, full: id };
        }
        if (parts.length === 2) {
            const prefix = parts[0];
            const id = parts[1];
            if (!SecureId.isValidRawId(id, config)) {
                throw new InvalidIdError(idString, 'Invalid ID format');
            }
            return { prefix, id, full: idString };
        }
        throw new InvalidIdError(idString, 'ID contains too many separators');
    }
    /**
     * Validate if a string is a valid ID
     */
    static isValid(idString, config) {
        try {
            const parsed = SecureId.parse(idString, config);
            return SecureId.isValidRawId(parsed.id, config);
        }
        catch {
            return false;
        }
    }
    /**
     * Validate if a raw ID (without prefix) is valid
     */
    static isValidRawId(rawId, config) {
        if (!rawId || typeof rawId !== 'string')
            return false;
        const alphabet = SecureId.getConfigValue('alphabet', config) ?? 'yvndrfg9ejkmcpqxwt2uwxsza345h769';
        const entropyBits = SecureId.getConfigValue('entropyBits', config) ?? 72;
        // Calculate expected length based on entropy bits
        const expectedLength = Math.ceil(entropyBits / 5); // 5 bits per character in base32
        const minLength = Math.floor(entropyBits / 5);
        const maxLength = Math.ceil(entropyBits / 5);
        // Performance optimization: check length first
        if (rawId.length < minLength || rawId.length > maxLength)
            return false;
        return rawId
            .split('')
            .every((char) => alphabet.includes(char.toLowerCase()));
    }
    static base32Encode(buffer, alphabet = SecureId.Z_BASE32_ALPHABET) {
        // For now, only support base32 encoding (32 characters)
        // In the future, we can add support for other encodings
        if (alphabet.length !== 32) {
            throw new SparkIdError(`Alphabet must have exactly 32 characters for base32 encoding. Got ${alphabet.length} characters.`, 'INVALID_ALPHABET');
        }
        let value = 0;
        let bits = 0;
        let result = '';
        for (let i = 0; i < buffer.length; i++) {
            value = (value << 8) | buffer[i];
            bits += 8;
            while (bits >= 5) {
                result += alphabet[(value >>> (bits - 5)) & 31];
                bits -= 5;
            }
        }
        if (bits > 0) {
            result += alphabet[(value << (5 - bits)) & 31];
        }
        return result;
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
     * Configure global settings
     */
    static configure(config) {
        SecureId.globalConfig = { ...SecureId.globalConfig, ...config };
    }
    /**
     * Get current global configuration
     */
    static getConfig() {
        return { ...SecureId.globalConfig };
    }
    /**
     * Reset configuration to defaults
     */
    static resetConfig() {
        SecureId.globalConfig = { ...types_js_1.DEFAULT_CONFIG };
    }
    /**
     * Get configuration value with fallback to defaults
     */
    static getConfigValue(key, localConfig) {
        return localConfig?.[key] ?? SecureId.globalConfig[key] ?? types_js_1.DEFAULT_CONFIG[key];
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
// Global configuration
SecureId.globalConfig = { ...types_js_1.DEFAULT_CONFIG };
// Legacy constants (deprecated, use config instead)
SecureId.Z_BASE32_ALPHABET = 'yvndrfg9ejkmcpqxwt2uwxsza345h769';
SecureId.BYTES_LENGTH = 9;
SecureId.PREFIX_SEPARATOR = '_';
SecureId.MAX_PREFIX_LENGTH = 50; // Prevent extremely long prefixes
SecureId.PREFIX_REGEX = /^[a-zA-Z0-9_]+$/;
// Convenience functions
const generateId = (prefix, config) => SecureId.generate(prefix, config);
exports.generateId = generateId;
const createId = (prefix, config) => SecureId.create(prefix, config);
exports.createId = createId;
const isValidId = (id, config) => SecureId.isValid(id, config);
exports.isValidId = isValidId;
const parseId = (id, config) => SecureId.parse(id, config);
exports.parseId = parseId;
// Enhanced convenience functions with better error handling
const generateIdSafe = (prefix, config) => {
    try {
        const id = SecureId.generate(prefix, config);
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
const validateId = (id, config) => {
    try {
        const isValid = SecureId.isValid(id, config);
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
const generateMultiple = (count, prefix, config) => {
    if (count <= 0) {
        throw new SparkIdError('Count must be greater than 0', 'INVALID_COUNT');
    }
    if (count > 1000) {
        throw new SparkIdError('Count cannot exceed 1000', 'COUNT_TOO_LARGE');
    }
    return Array.from({ length: count }, () => SecureId.generate(prefix, config));
};
exports.generateMultiple = generateMultiple;
const generateUnique = (count, prefix, config) => {
    const ids = new Set();
    let attempts = 0;
    const maxAttempts = count * 10; // Prevent infinite loops
    while (ids.size < count && attempts < maxAttempts) {
        ids.add(SecureId.generate(prefix, config));
        attempts++;
    }
    if (ids.size < count) {
        throw new SparkIdError(`Failed to generate ${count} unique IDs after ${maxAttempts} attempts`, 'GENERATION_FAILED');
    }
    return ids;
};
exports.generateUnique = generateUnique;
// Global configuration functions
const configure = (config) => {
    SecureId.configure(config);
};
exports.configure = configure;
const getConfig = () => {
    return SecureId.getConfig();
};
exports.getConfig = getConfig;
const resetConfig = () => {
    SecureId.resetConfig();
};
exports.resetConfig = resetConfig;
//# sourceMappingURL=secure-id.js.map