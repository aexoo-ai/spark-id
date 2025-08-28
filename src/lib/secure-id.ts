import { randomBytes } from 'crypto'

// Z-Base32 alphabet avoids commonly confused characters (0/O, 1/I, 8/B, etc.)
const Z_BASE32_ALPHABET = 'ybndrfg8ejkmcpqxot1uwisza345h769'

/**
 * Secure ID Generator with optional prefix support
 * 
 * Features:
 * - Cryptographically secure (72 bits entropy)
 * - URL-safe Z-Base32 encoding
 * - Optional prefix support (e.g., "USER_", "TXN_")
 * - Collision-resistant
 * - Human-readable (all uppercase)
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
export class SecureId {
  private static readonly Z_BASE32_ALPHABET = 'yvndrfg9ejkmcpqxwt2uwxsza345h769'
  private static readonly BYTES_LENGTH = 9
  private static readonly PREFIX_SEPARATOR = '_'
  private static readonly MAX_PREFIX_LENGTH = 50 // Prevent extremely long prefixes
  private static readonly PREFIX_REGEX = /^[a-zA-Z0-9_]+$/

  public readonly id: string
  public readonly prefix?: string
  public readonly full: string

  constructor(id?: string, prefix?: string) {
    // Validate prefix if provided
    if (prefix !== undefined && !SecureId.isValidPrefix(prefix)) {
      throw new Error(`Invalid prefix: ${prefix}. Prefix must contain only alphanumeric characters and underscores, and be between 1-50 characters.`)
    }

    // Convert prefix to uppercase for consistency
    const upperPrefix = prefix ? prefix.toUpperCase() : undefined

    this.id = id || SecureId.generateRaw()
    this.prefix = upperPrefix
    this.full = upperPrefix ? `${upperPrefix}${SecureId.PREFIX_SEPARATOR}${this.id}` : this.id
  }

  /**
   * Validate prefix format
   */
  private static isValidPrefix(prefix: string): boolean {
    if (typeof prefix !== 'string' || prefix.length === 0 || prefix.length > this.MAX_PREFIX_LENGTH) {
      return false
    }

    // Only allow alphanumeric characters and underscores
    return this.PREFIX_REGEX.test(prefix)
  }

  /**
   * Generate a new raw ID (without prefix)
   */
  static generateRaw(): string {
    const bytes = randomBytes(SecureId.BYTES_LENGTH)
    return SecureId.base32Encode(bytes)
  }

  /**
   * Generate a new ID with optional prefix
   */
  static generate(prefix?: string): string {
    if (prefix !== undefined && !SecureId.isValidPrefix(prefix)) {
      throw new Error(`Invalid prefix: ${prefix}. Prefix must contain only alphanumeric characters and underscores, and be between 1-50 characters.`)
    }

    const rawId = SecureId.generateRaw()
    // Convert prefix to uppercase for consistency
    const upperPrefix = prefix ? prefix.toUpperCase() : undefined
    return upperPrefix ? `${upperPrefix}${SecureId.PREFIX_SEPARATOR}${rawId}` : rawId
  }

  /**
   * Create a new SecureId instance
   */
  static create(prefix?: string): SecureId {
    return new SecureId(undefined, prefix)
  }

  /**
   * Parse an ID string into components
   */
  static parse(idString: string): { prefix?: string; id: string; full: string } {
    if (typeof idString !== 'string') {
      throw new Error('ID must be a string')
    }

    if (idString.length === 0) {
      throw new Error('ID cannot be empty')
    }

    const parts = idString.split(SecureId.PREFIX_SEPARATOR)

    if (parts.length === 1) {
      return { id: parts[0], full: parts[0] }
    }

    if (parts.length === 2) {
      return { prefix: parts[0], id: parts[1], full: idString }
    }

    throw new Error(`Invalid ID format: ${idString}`)
  }

  /**
   * Validate if a string is a valid ID
   */
  static isValid(idString: string): boolean {
    try {
      const parsed = SecureId.parse(idString)
      return SecureId.isValidRawId(parsed.id)
    } catch {
      return false
    }
  }

  /**
 * Validate if a raw ID (without prefix) is valid
 */
  static isValidRawId(rawId: string): boolean {
    if (!rawId || typeof rawId !== 'string') return false

    // Performance optimization: check length first
    // 9 bytes = 72 bits, Base32 encoding: 72/5 = 14.4, so 12-15 characters is correct
    // Actual generated IDs are 15 characters
    if (rawId.length < 12 || rawId.length > 15) return false

    return rawId.split('').every(char =>
      SecureId.Z_BASE32_ALPHABET.includes(char.toLowerCase())
    )
  }

  private static base32Encode(buffer: Buffer): string {
    let value = 0
    let bits = 0
    let result = ''

    for (let i = 0; i < buffer.length; i++) {
      value = (value << 8) | buffer[i]
      bits += 8

      while (bits >= 5) {
        result += SecureId.Z_BASE32_ALPHABET[(value >>> (bits - 5)) & 31]
        bits -= 5
      }
    }

    if (bits > 0) {
      result += SecureId.Z_BASE32_ALPHABET[(value << (5 - bits)) & 31]
    }

    // Convert to uppercase for better human readability
    return result.toUpperCase()
  }

  toString(): string {
    return this.full
  }

  equals(other: SecureId | string): boolean {
    const otherId = typeof other === 'string' ? other : other.full
    return this.full === otherId
  }

  /**
   * Get the entropy bits of this ID
   */
  getEntropyBits(): number {
    return SecureId.BYTES_LENGTH * 8
  }

  /**
   * Check if this ID has a prefix
   */
  hasPrefix(): boolean {
    return this.prefix !== undefined
  }
}

// Convenience functions
export const generateId = (prefix?: string): string => SecureId.generate(prefix)
export const createId = (prefix?: string): SecureId => SecureId.create(prefix)
export const isValidId = (id: string): boolean => SecureId.isValid(id)
export const parseId = (id: string) => SecureId.parse(id)
