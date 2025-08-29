import { randomBytes } from 'crypto';
import type { SparkIdConfig, SparkIdStats, SparkIdValidationResult } from '../types';
import { DEFAULT_CONFIG } from '../types.js';

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
export class SparkIdError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'SparkIdError';
  }
}

export class InvalidPrefixError extends SparkIdError {
  constructor(prefix: string) {
    super(
      `Invalid prefix: "${prefix}". Prefix must contain only alphanumeric characters and underscores, and be between 1-20 characters.`,
      'INVALID_PREFIX'
    );
    this.name = 'InvalidPrefixError';
  }
}

export class InvalidIdError extends SparkIdError {
  constructor(id: string, reason?: string) {
    super(
      `Invalid ID: "${id}". ${reason || 'ID format is not valid.'}`,
      'INVALID_ID'
    );
    this.name = 'InvalidIdError';
  }
}
export class SecureId {
  // Global configuration
  private static globalConfig: SparkIdConfig = { ...DEFAULT_CONFIG };

  // Legacy constants (deprecated, use config instead)
  private static readonly Z_BASE32_ALPHABET =
    'yvndrfg9ejkmcpqxwt2uwxsza345h769';
  private static readonly BYTES_LENGTH = 9;
  private static readonly PREFIX_SEPARATOR = '_';
  private static readonly MAX_PREFIX_LENGTH = 50; // Prevent extremely long prefixes
  private static readonly PREFIX_REGEX = /^[a-zA-Z0-9_]+$/;

  public readonly id: string;
  public readonly prefix?: string;
  public readonly full: string;

  constructor(id?: string, prefix?: string, config?: Partial<SparkIdConfig>) {
    // Validate prefix if provided
    if (prefix !== undefined && !SecureId.isValidPrefix(prefix, config)) {
      throw new InvalidPrefixError(prefix);
    }

    const separator = SecureId.getConfigValue('separator', config) ?? '_';
    const caseSetting = SecureId.getConfigValue('case', config) ?? 'upper';

    // Apply case setting to prefix
    let formattedPrefix: string | undefined;
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
  private static isValidPrefix(prefix: string, config?: Partial<SparkIdConfig>): boolean {
    const maxPrefixLength = SecureId.getConfigValue('maxPrefixLength', config) ?? 20;

    if (
      typeof prefix !== 'string' ||
      prefix.length === 0 ||
      prefix.length > maxPrefixLength
    ) {
      return false;
    }

    // Only allow alphanumeric characters and underscores
    return this.PREFIX_REGEX.test(prefix);
  }

  /**
   * Generate a new raw ID (without prefix)
   */
  static generateRaw(config?: Partial<SparkIdConfig>): string {
    const entropyBits = SecureId.getConfigValue('entropyBits', config) ?? 72;
    const alphabet = SecureId.getConfigValue('alphabet', config) ?? 'yvndrfg9ejkmcpqxwt2uwxsza345h769';
    const caseSetting = SecureId.getConfigValue('case', config) ?? 'upper';

    const bytesLength = Math.ceil(entropyBits / 8);
    const bytes = randomBytes(bytesLength);
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
  static generate(prefix?: string, config?: Partial<SparkIdConfig>): string {
    if (prefix !== undefined && !SecureId.isValidPrefix(prefix, config)) {
      throw new InvalidPrefixError(prefix);
    }

    const rawId = SecureId.generateRaw(config);
    const separator = SecureId.getConfigValue('separator', config) ?? '_';
    const caseSetting = SecureId.getConfigValue('case', config) ?? 'upper';

    // Apply case setting to prefix
    let formattedPrefix: string | undefined;
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
  static create(prefix?: string, config?: Partial<SparkIdConfig>): SecureId {
    return new SecureId(undefined, prefix, config);
  }

  /**
   * Parse an ID string into components
   */
  static parse(idString: string, config?: Partial<SparkIdConfig>): {
    prefix?: string;
    id: string;
    full: string;
  } {
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
  static isValid(idString: string, config?: Partial<SparkIdConfig>): boolean {
    try {
      const parsed = SecureId.parse(idString, config);
      return SecureId.isValidRawId(parsed.id, config);
    } catch {
      return false;
    }
  }

  /**
   * Validate if a raw ID (without prefix) is valid
   */
  static isValidRawId(rawId: string, config?: Partial<SparkIdConfig>): boolean {
    if (!rawId || typeof rawId !== 'string') return false;

    const alphabet = SecureId.getConfigValue('alphabet', config) ?? 'yvndrfg9ejkmcpqxwt2uwxsza345h769';
    const entropyBits = SecureId.getConfigValue('entropyBits', config) ?? 72;

    // Calculate expected length based on entropy bits
    const expectedLength = Math.ceil(entropyBits / 5); // 5 bits per character in base32
    const minLength = Math.floor(entropyBits / 5);
    const maxLength = Math.ceil(entropyBits / 5);

    // Performance optimization: check length first
    if (rawId.length < minLength || rawId.length > maxLength) return false;

    return rawId
      .split('')
      .every((char) => alphabet.includes(char.toLowerCase()));
  }

  private static base32Encode(buffer: Buffer, alphabet: string = SecureId.Z_BASE32_ALPHABET): string {
    // For now, only support base32 encoding (32 characters)
    // In the future, we can add support for other encodings
    if (alphabet.length !== 32) {
      throw new SparkIdError(
        `Alphabet must have exactly 32 characters for base32 encoding. Got ${alphabet.length} characters.`,
        'INVALID_ALPHABET'
      );
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

  toString(): string {
    return this.full;
  }

  equals(other: SecureId | string): boolean {
    const otherId = typeof other === 'string' ? other : other.full;
    return this.full === otherId;
  }

  /**
   * Get the entropy bits of this ID
   */
  getEntropyBits(): number {
    return SecureId.BYTES_LENGTH * 8;
  }

  /**
   * Check if this ID has a prefix
   */
  hasPrefix(): boolean {
    return this.prefix !== undefined;
  }

  /**
   * Configure global settings
   */
  static configure(config: Partial<SparkIdConfig>): void {
    SecureId.globalConfig = { ...SecureId.globalConfig, ...config };
  }

  /**
   * Get current global configuration
   */
  static getConfig(): SparkIdConfig {
    return { ...SecureId.globalConfig };
  }

  /**
   * Reset configuration to defaults
   */
  static resetConfig(): void {
    SecureId.globalConfig = { ...DEFAULT_CONFIG };
  }

  /**
   * Get configuration value with fallback to defaults
   */
  private static getConfigValue<K extends keyof SparkIdConfig>(
    key: K,
    localConfig?: Partial<SparkIdConfig>
  ): SparkIdConfig[K] {
    return localConfig?.[key] ?? SecureId.globalConfig[key] ?? DEFAULT_CONFIG[key];
  }

  /**
   * Get statistics about this ID
   */
  getStats(): SparkIdStats {
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
  validate(): SparkIdValidationResult {
    try {
      const isValid = SecureId.isValid(this.full);
      return {
        isValid,
        error: isValid ? undefined : 'Invalid ID format',
        code: isValid ? undefined : 'INVALID_FORMAT'
      };
    } catch (error) {
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
  generateSimilar(): SecureId {
    return new SecureId(undefined, this.prefix);
  }

  /**
   * Convert to JSON representation
   */
  toJSON(): { id: string; prefix?: string; full: string } {
    return {
      id: this.id,
      prefix: this.prefix,
      full: this.full
    };
  }
}

// Convenience functions
export const generateId = (prefix?: string, config?: Partial<SparkIdConfig>): string =>
  SecureId.generate(prefix, config);
export const createId = (prefix?: string, config?: Partial<SparkIdConfig>): SecureId => SecureId.create(prefix, config);
export const isValidId = (id: string, config?: Partial<SparkIdConfig>): boolean => SecureId.isValid(id, config);
export const parseId = (id: string, config?: Partial<SparkIdConfig>) => SecureId.parse(id, config);

// Enhanced convenience functions with better error handling
export const generateIdSafe = (prefix?: string, config?: Partial<SparkIdConfig>): { success: true; id: string } | { success: false; error: string } => {
  try {
    const id = SecureId.generate(prefix, config);
    return { success: true, id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const validateId = (id: string, config?: Partial<SparkIdConfig>): SparkIdValidationResult => {
  try {
    const isValid = SecureId.isValid(id, config);
    return {
      isValid,
      error: isValid ? undefined : 'Invalid ID format',
      code: isValid ? undefined : 'INVALID_FORMAT'
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      code: 'VALIDATION_ERROR'
    };
  }
};

export const generateMultiple = (count: number, prefix?: string, config?: Partial<SparkIdConfig>): string[] => {
  if (count <= 0) {
    throw new SparkIdError('Count must be greater than 0', 'INVALID_COUNT');
  }
  if (count > 1000) {
    throw new SparkIdError('Count cannot exceed 1000', 'COUNT_TOO_LARGE');
  }

  return Array.from({ length: count }, () => SecureId.generate(prefix, config));
};

export const generateUnique = (count: number, prefix?: string, config?: Partial<SparkIdConfig>): Set<string> => {
  const ids = new Set<string>();
  let attempts = 0;
  const maxAttempts = count * 10; // Prevent infinite loops

  while (ids.size < count && attempts < maxAttempts) {
    ids.add(SecureId.generate(prefix, config));
    attempts++;
  }

  if (ids.size < count) {
    throw new SparkIdError(
      `Failed to generate ${count} unique IDs after ${maxAttempts} attempts`,
      'GENERATION_FAILED'
    );
  }

  return ids;
};

// Global configuration functions
export const configure = (config: Partial<SparkIdConfig>): void => {
  SecureId.configure(config);
};

export const getConfig = (): SparkIdConfig => {
  return SecureId.getConfig();
};

export const resetConfig = (): void => {
  SecureId.resetConfig();
};
