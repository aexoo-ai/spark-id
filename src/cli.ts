#!/usr/bin/env node

import { generateId, isValidId, parseId } from './lib/secure-id'

interface CliOptions {
  prefix?: string
  count?: number
  validate?: string
  parse?: string
  help?: boolean
  format?: 'json' | 'text' | 'csv'
  examples?: boolean
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2)
  const options: CliOptions = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case '--prefix':
      case '-p':
        options.prefix = args[++i]
        break
      case '--count':
      case '-c':
        options.count = parseInt(args[++i], 10)
        break
      case '--validate':
      case '-v':
        options.validate = args[++i]
        break
      case '--parse':
        options.parse = args[++i]
        break
      case '--format':
      case '-f':
        options.format = args[++i] as 'json' | 'text' | 'csv'
        break
      case '--examples':
      case '-e':
        options.examples = true
        break
      case '--help':
      case '-h':
        options.help = true
        break
    }
  }

  return options
}

function showHelp() {
  console.log(`
@aexoo-ai/spark-id - Generate cryptographically secure, URL-safe IDs

Usage:
  spark-id [options]

Options:
  -p, --prefix <prefix>      Add prefix to generated IDs (e.g., USER, TXN)
  -c, --count <number>       Generate multiple IDs (default: 1)
  -v, --validate <id>        Validate if an ID is properly formatted
  --parse <id>               Parse an ID and show its components
  -f, --format <format>      Output format: json, text, csv (default: text)
  -e, --examples             Show usage examples
  -h, --help                 Show this help message

Examples:
  spark-id                                    # Generate a single ID
  spark-id -p USER                           # Generate ID with USER prefix
  spark-id -p TXN -c 5                       # Generate 5 transaction IDs
  spark-id -v USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769  # Validate an ID
  spark-id --parse USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769  # Parse an ID

Output formats:
  - text: plain text (default)
  - json: JSON array or object
  - csv: comma-separated values

Exit codes:
  0: Success
  1: Error or validation failed
`)
}

function showExamples() {
  console.log(`
Usage Examples:

# Basic generation
$ spark-id
YBNDRFG8EJKMCPQXOT1UWISZA345H769

# With prefix
$ spark-id -p USER
USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769

# Multiple IDs
$ spark-id -c 3
YBNDRFG8EJKMCPQXOT1UWISZA345H769
ABC123DEF456GHI789
XYZ789UVW012MNO345

# Multiple IDs with prefix in JSON format
$ spark-id -p TXN -c 2 -f json
[
  "TXN_YBNDRFG8EJKMCPQXOT1UWISZA345H769",
  "TXN_ABC123DEF456GHI789"
]

# Validation
$ spark-id -v USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769
true

$ spark-id -v invalid-id
false

# Parsing
$ spark-id --parse USER_ybndrfg8ejkmcpqxot1uwisza345h769
{
  "prefix": "USER",
  "id": "ybndrfg8ejkmcpqxot1uwisza345h769",
  "full": "USER_ybndrfg8ejkmcpqxot1uwisza345h769"
}

# In scripts
$ for i in {1..5}; do echo "ID $i: $(spark-id -p USER)"; done
ID 1: USER_ybndrfg8ejkmcpqxot1uwisza345h769
ID 2: USER_abc123def456ghi789
ID 3: USER_xyz789uvw012mno345
ID 4: USER_def456ghi789jkl012
ID 5: USER_mno345pqr678stu901

# Database seeding
$ spark-id -p USER -c 100 | while read id; do echo "INSERT INTO users (id) VALUES ('$id');"; done
INSERT INTO users (id) VALUES ('USER_ybndrfg8ejkmcpqxot1uwisza345h769');
INSERT INTO users (id) VALUES ('USER_abc123def456ghi789');
...

# API testing
$ curl -X POST http://localhost:3000/api/users \\
  -H "Content-Type: application/json" \\
  -d "{\\"id\\": \\"$(spark-id -p USER)\\", \\"name\\": \\"John Doe\\"}"
`)
}

function outputIds(ids: string[], format: string = 'text') {
  switch (format) {
    case 'json':
      if (ids.length === 1) {
        console.log(JSON.stringify(ids[0]))
      } else {
        console.log(JSON.stringify(ids, null, 2))
      }
      break
    case 'csv':
      console.log(ids.join(','))
      break
    case 'text':
    default:
      ids.forEach(id => console.log(id))
      break
  }
}

function main() {
  const options = parseArgs()

  if (options.help) {
    showHelp()
    return
  }

  if (options.examples) {
    showExamples()
    return
  }

  // Validation mode
  if (options.validate) {
    const isValid = isValidId(options.validate)
    console.log(isValid)
    process.exit(isValid ? 0 : 1)
  }

  // Parse mode
  if (options.parse) {
    try {
      const parsed = parseId(options.parse)
      console.log(JSON.stringify(parsed, null, 2))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error('Error parsing ID:', errorMessage)
      process.exit(1)
    }
    return
  }

  // Generation mode
  const count = options.count || 1
  const ids: string[] = []

  for (let i = 0; i < count; i++) {
    ids.push(generateId(options.prefix))
  }

  outputIds(ids, options.format)
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  const errorMessage = error instanceof Error ? error.message : String(error)
  console.error('Error:', errorMessage)
  process.exit(1)
})

if (require.main === module) {
  main()
}
