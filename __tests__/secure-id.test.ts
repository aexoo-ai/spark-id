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
    const validIds = [
      'ybndrfg8ejkmcpqxot1uwisza345h769',
      'ybndrfg8ejkmcpqxot1uwisza345h769',
      'ejkmcpqxot1uwisza345h769ybndrfg8',
      'USER_ybndrfg8ejkmcpqxot1uwisza345h769',
      'TXN_ejkmcpqxot1uwisza345h769ybndrfg8'
    ]

    validIds.forEach(id => {
      expect(isValidId(id)).toBe(true)
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
    const parsed1 = parseId('ybndrfg8ejkmcpqxot1uwisza345h769')
    expect(parsed1).toEqual({
      id: 'ybndrfg8ejkmcpqxot1uwisza345h769',
      full: 'ybndrfg8ejkmcpqxot1uwisza345h769'
    })

    // ID with prefix
    const parsed2 = parseId('USER_ybndrfg8ejkmcpqxot1uwisza345h769')
    expect(parsed2).toEqual({
      prefix: 'USER',
      id: 'ybndrfg8ejkmcpqxot1uwisza345h769',
      full: 'USER_ybndrfg8ejkmcpqxot1uwisza345h769'
    })
  })

  it('should handle SecureId constructor with existing ID', () => {
    const existingId = 'ybndrfg8ejkmcpqxot1uwisza345h769'
    const secureId = new SecureId(existingId)
    expect(secureId.id).toBe(existingId)
  })

  it('should handle SecureId constructor without ID', () => {
    const secureId = new SecureId()
    expect(typeof secureId.id).toBe('string')
    expect(isValidId(secureId.id)).toBe(true)
  })

  it('should handle SecureId.equals method', () => {
    const id1 = new SecureId('ybndrfg8ejkmcpqxot1uwisza345h769')
    const id2 = new SecureId('ybndrfg8ejkmcpqxot1uwisza345h769')
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
})
