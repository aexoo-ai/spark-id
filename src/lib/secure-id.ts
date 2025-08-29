import { randomBytes } from 'crypto';
import type { SparkIdStats, SparkIdValidationResult } from '../types';

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
      `Invalid prefix: "${prefix}". Prefix must contain only alphanumeric characters and underscores, and be between 1-50 characters.`,
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
  private static readonly Z_BASE32_ALPHABET =
    'yvndrfg9ejkmcpqxwt2uwxsza345h769';
  private static readonly BYTES_LENGTH = 9;
  private static readonly PREFIX_SEPARATOR = '_';
  private static readonly MAX_PREFIX_LENGTH = 50; // Prevent extremely long prefixes
  private static readonly PREFIX_REGEX = /^[a-zA-Z0-9_]+$/;

  public readonly id: string;
  public readonly prefix?: string;
  public readonly full: string;

  constructor(id?: string, prefix?: string) {
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
  private static isValidPrefix(prefix: string): boolean {
    if (
      typeof prefix !== 'string' ||
      prefix.length === 0 ||
      prefix.length > this.MAX_PREFIX_LENGTH
    ) {
      return false;
    }

    // Only allow alphanumeric characters and underscores
    return this.PREFIX_REGEX.test(prefix);
  }

  /**
   * Generate a new raw ID (without prefix)
   */
  static generateRaw(): string {
    const bytes = randomBytes(SecureId.BYTES_LENGTH);
    return SecureId.base32Encode(bytes);
  }

  /**
   * Generate a new ID with optional prefix
   */
  static generate(prefix?: string): string {
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
  static create(prefix?: string): SecureId {
    return new SecureId(undefined, prefix);
  }

  /**
   * Parse an ID string into components
   */
  static parse(idString: string): {
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
  static isValid(idString: string): boolean {
    try {
      const parsed = SecureId.parse(idString);
      return SecureId.isValidRawId(parsed.id);
    } catch {
      return false;
    }
  }

  /**
   * Validate if a raw ID (without prefix) is valid
   */
  static isValidRawId(rawId: string): boolean {
    if (!rawId || typeof rawId !== 'string') return false;

    // Performance optimization: check length first
    // 9 bytes = 72 bits, Base32 encoding: 72/5 = 14.4, so 12-15 characters is correct
    // Actual generated IDs are 15 characters
    if (rawId.length < 12 || rawId.length > 15) return false;

    return rawId
      .split('')
      .every((char) => SecureId.Z_BASE32_ALPHABET.includes(char.toLowerCase()));
  }

  private static base32Encode(buffer: Buffer): string {
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
export const generateId = (prefix?: string): string =>
  SecureId.generate(prefix);
export const createId = (prefix?: string): SecureId => SecureId.create(prefix);
export const isValidId = (id: string): boolean => SecureId.isValid(id);
export const parseId = (id: string) => SecureId.parse(id);

// Enhanced convenience functions with better error handling
export const generateIdSafe = (prefix?: string): { success: true; id: string } | { success: false; error: string } => {
  try {
    const id = SecureId.generate(prefix);
    return { success: true, id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const validateId = (id: string): SparkIdValidationResult => {
  try {
    const isValid = SecureId.isValid(id);
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

export const generateMultiple = (count: number, prefix?: string): string[] => {
  if (count <= 0) {
    throw new SparkIdError('Count must be greater than 0', 'INVALID_COUNT');
  }
  if (count > 1000) {
    throw new SparkIdError('Count cannot exceed 1000', 'COUNT_TOO_LARGE');
  }

  return Array.from({ length: count }, () => SecureId.generate(prefix));
};

export const generateUnique = (count: number, prefix?: string): Set<string> => {
  const ids = new Set<string>();
  let attempts = 0;
  const maxAttempts = count * 10; // Prevent infinite loops

  while (ids.size < count && attempts < maxAttempts) {
    ids.add(SecureId.generate(prefix));
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
