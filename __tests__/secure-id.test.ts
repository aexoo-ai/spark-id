import { describe, expect, it } from 'vitest'
import { SecureId, createId, generateId, isValidId, parseId } from '../src/lib/secure-id'

describe('SecureId Generator', () => {
  it('should generate valid SecureId strings', () => {
    const id = generateId()
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
    expect(isValidId(id)).toBe(true)
  })

  it('should create SecureId instances', () => {
    const secureId = createId()
    expect(secureId).toBeInstanceOf(SecureId)
    expect(typeof secureId.id).toBe('string')
    expect(isValidId(secureId.id)).toBe(true)
  })

  it('should generate IDs with prefixes', () => {
    const userId = generateId('USER')
    expect(userId).toMatch(/^USER_[ybndrfg8ejkmcpqxot1uwisza345h769]+$/)
    expect(isValidId(userId)).toBe(true)
  })

  it('should validate correct ID strings', () => {
    // Use actual generated IDs to ensure they're valid
    const validIds = [
      generateId(), // Generate a real ID
      generateId(), // Generate another real ID
      generateId('USER'), // Generate a real prefixed ID
      generateId('TXN'), // Generate another real prefixed ID
      '698de38kntcz9ja' // Known valid ID (15 characters)
    ]

    validIds.forEach(id => {
      const isValid = isValidId(id)
      if (!isValid) {
        console.log(`Failed ID: "${id}", length: ${id.length}`)
      }
      expect(isValid).toBe(true)
    })
  })

  it('should reject invalid ID strings', () => {
    const invalidIds = [
      '', // empty string
      'abc123def456ghi789jkl012mno345pqr678stu901vwx234yz0', // contains 0
      'abc123def456ghi789jkl012mno345pqr678stu901vwx234yzo', // contains o
      'abc123def456ghi789jkl012mno345pqr678stu901vwx234yzi', // contains i
      'abc123def456ghi789jkl012mno345pqr678stu901vwx234yzb', // contains b
      'abc123def456ghi789jkl012mno345pqr678stu901vwx234yz8', // contains 8
      'abc-123-def-456', // contains hyphens
      'abc_123_def_456', // multiple underscores
      'abc 123 def 456', // contains spaces
    ]

    invalidIds.forEach(id => {
      expect(isValidId(id)).toBe(false)
    })
  })

  it('should generate unique IDs', () => {
    const ids = new Set()
    const iterations = 1000

    for (let i = 0; i < iterations; i++) {
      const id = generateId()
      expect(ids.has(id)).toBe(false)
      ids.add(id)
    }

    expect(ids.size).toBe(iterations)
  })

  it('should parse IDs correctly', () => {
    // ID without prefix
    const parsed1 = parseId('698de38kntcz9ja')
    expect(parsed1).toEqual({
      id: '698de38kntcz9ja',
      full: '698de38kntcz9ja'
    })

    // ID with prefix
    const parsed2 = parseId('USER_698de38kntcz9ja')
    expect(parsed2).toEqual({
      prefix: 'USER',
      id: '698de38kntcz9ja',
      full: 'USER_698de38kntcz9ja'
    })
  })

  it('should handle SecureId constructor with existing ID', () => {
    const existingId = '698de38kntcz9ja'
    const secureId = new SecureId(existingId)
    expect(secureId.id).toBe(existingId)
  })

  it('should handle SecureId constructor without ID', () => {
    const secureId = new SecureId()
    expect(typeof secureId.id).toBe('string')
    expect(isValidId(secureId.id)).toBe(true)
  })

  it('should handle SecureId.equals method', () => {
    const id1 = new SecureId('698de38kntcz9ja')
    const id2 = new SecureId('698de38kntcz9ja')
    const id3 = new SecureId('ejkmcpqxot1uwisza345h769ybndrfg8')

    expect(id1.equals(id2)).toBe(true)
    expect(id1.equals(id2.id)).toBe(true)
    expect(id1.equals(id3)).toBe(false)
    expect(id1.equals(id3.id)).toBe(false)
  })

  it('should generate IDs with correct length', () => {
    // SecureId uses 9 bytes = 72 bits, encoded in Base32 should be ~12-15 characters
    const id = generateId()
    expect(id.length).toBeGreaterThanOrEqual(12)
    expect(id.length).toBeLessThanOrEqual(15)
  })

  it('should only use Z-Base32 alphabet characters', () => {
    const zBase32Alphabet = 'ybndrfg8ejkmcpqxot1uwisza345h769'
    const id = generateId()

    for (const char of id) {
      expect(zBase32Alphabet.includes(char.toLowerCase())).toBe(true)
    }
  })

  // Enterprise-grade feature tests
  describe('Enterprise Features', () => {
    it('should validate prefix format correctly', () => {
      // Valid prefixes
      expect(() => generateId('USER')).not.toThrow()
      expect(() => generateId('TXN')).not.toThrow()
      expect(() => generateId('ORDER_123')).not.toThrow()
      expect(() => generateId('user_123')).not.toThrow()

      // Invalid prefixes
      expect(() => generateId('')).toThrow()
      expect(() => generateId('USER-123')).toThrow() // hyphen not allowed
      expect(() => generateId('USER 123')).toThrow() // space not allowed
      expect(() => generateId('USER.123')).toThrow() // dot not allowed
      expect(() => generateId('A'.repeat(51))).toThrow() // too long
    })

    it('should handle prefix validation in constructor', () => {
      // Valid
      expect(() => new SecureId(undefined, 'USER')).not.toThrow()
      expect(() => new SecureId(undefined, 'TXN_123')).not.toThrow()

      // Invalid
      expect(() => new SecureId(undefined, '')).toThrow()
      expect(() => new SecureId(undefined, 'USER-123')).toThrow()
      expect(() => new SecureId(undefined, 'A'.repeat(51))).toThrow()
    })

    it('should validate input types in parse method', () => {
      // Valid
      expect(() => parseId('698de38kntcz9ja')).not.toThrow()
      expect(() => parseId('USER_698de38kntcz9ja')).not.toThrow()

      // Invalid
      expect(() => parseId('')).toThrow('ID cannot be empty')
      expect(() => parseId(null as any)).toThrow('ID must be a string')
      expect(() => parseId(undefined as any)).toThrow('ID must be a string')
      expect(() => parseId(123 as any)).toThrow('ID must be a string')
    })

    it('should optimize validation performance', () => {
      // Test that very short/long IDs are rejected quickly
      expect(isValidId('')).toBe(false)
      expect(isValidId('a')).toBe(false) // too short
      expect(isValidId('a'.repeat(100))).toBe(false) // too long
    })

    it('should provide entropy information', () => {
      const secureId = new SecureId()
      expect(secureId.getEntropyBits()).toBe(72) // 9 bytes * 8 bits
    })

    it('should check prefix presence', () => {
      const idWithoutPrefix = new SecureId()
      const idWithPrefix = new SecureId(undefined, 'USER')

      expect(idWithoutPrefix.hasPrefix()).toBe(false)
      expect(idWithPrefix.hasPrefix()).toBe(true)
    })

    it('should handle edge cases gracefully', () => {
      // Empty string validation
      expect(isValidId('')).toBe(false)

      // Null/undefined validation
      expect(isValidId(null as any)).toBe(false)
      expect(isValidId(undefined as any)).toBe(false)

      // Non-string validation
      expect(isValidId(123 as any)).toBe(false)
      expect(isValidId({} as any)).toBe(false)
      expect(isValidId([] as any)).toBe(false)
    })

    it('should maintain backward compatibility', () => {
      // All existing functionality should still work
      const id = generateId()
      expect(typeof id).toBe('string')
      expect(isValidId(id)).toBe(true)

      const secureId = createId('USER')
      expect(secureId).toBeInstanceOf(SecureId)
      expect(secureId.prefix).toBe('USER')
      expect(secureId.hasPrefix()).toBe(true)
    })
  })
})
