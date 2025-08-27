# CLI Installation

Learn how to install and set up the Spark-ID command-line interface.

## Prerequisites

Before installing the CLI, ensure you have:

- **Node.js** version 16 or higher
- **npm** or **pnpm** package manager
- **Git** (optional, for development)

### Check Your Environment

```bash
# Check Node.js version
node --version
# Should be v16.0.0 or higher

# Check npm version
npm --version
# Should be 8.0.0 or higher

# Check pnpm version (if using pnpm)
pnpm --version
# Should be 7.0.0 or higher
```

## Installation Methods

### Method 1: Global Installation (Recommended)

Install the CLI globally to use it from anywhere:

```bash
# Using npm
npm install -g @aexoo-ai/spark-id

# Using pnpm
pnpm add -g @aexoo-ai/spark-id

# Using yarn
yarn global add @aexoo-ai/spark-id
```

**Verify Installation:**

```bash
spark-id --version
# Should display the version number

spark-id --help
# Should display help information
```

### Method 2: Using npx (No Installation)

Use the CLI without installing it globally:

```bash
# Generate a single ID
npx @aexoo-ai/spark-id

# Generate with prefix
npx @aexoo-ai/spark-id -p USER

# Get help
npx @aexoo-ai/spark-id --help
```

**Advantages:**

- No global installation required
- Always uses the latest version
- No conflicts with other projects

**Disadvantages:**

- Slower startup time
- Requires internet connection
- Cannot use in offline scripts

### Method 3: Local Installation

Install in a specific project:

```bash
# Navigate to your project
cd your-project

# Install as a dependency
npm install @aexoo-ai/spark-id

# Use with npx
npx spark-id

# Or add to package.json scripts
```

**package.json example:**

```json
{
  "scripts": {
    "generate-user-id": "spark-id -p USER",
    "generate-txn-id": "spark-id -p TXN",
    "validate-id": "spark-id -v"
  }
}
```

## Platform-Specific Instructions

### Windows

#### Using npm

```bash
# Open Command Prompt or PowerShell as Administrator
npm install -g @aexoo-ai/spark-id

# Verify installation
spark-id --version
```

#### Using Chocolatey

```bash
# Install Chocolatey first (if not installed)
# Then install Spark-ID
choco install spark-id
```

#### Using Scoop

```bash
# Install Scoop first (if not installed)
# Then install Spark-ID
scoop install spark-id
```

### macOS

#### Using npm

```bash
# Install globally
npm install -g @aexoo-ai/spark-id

# Verify installation
spark-id --version
```

#### Using Homebrew

```bash
# Install Homebrew first (if not installed)
# Then install Spark-ID
brew install spark-id
```

### Linux

#### Using npm

```bash
# Install globally
sudo npm install -g @aexoo-ai/spark-id

# Verify installation
spark-id --version
```

#### Using Snap

```bash
# Install using snap
sudo snap install spark-id

# Verify installation
spark-id --version
```

#### Using AppImage

```bash
# Download and make executable
chmod +x spark-id.AppImage
./spark-id.AppImage --version
```

## Development Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/aexoo-ai/spark-id.git
cd spark-id

# Install dependencies
npm install

# Build the project
npm run build

# Link globally for development
npm link

# Verify installation
spark-id --version
```

### Using npm link

```bash
# In the spark-id directory
npm link

# In your project directory
npm link @aexoo-ai/spark-id
```

## Troubleshooting

### Permission Errors

#### Windows

```bash
# Run Command Prompt as Administrator
# Then install globally
npm install -g @aexoo-ai/spark-id
```

#### macOS/Linux

```bash
# Use sudo for global installation
sudo npm install -g @aexoo-ai/spark-id

# Or configure npm to use a different directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g @aexoo-ai/spark-id
```

### Command Not Found

```bash
# Check if the binary is in your PATH
which spark-id

# Check npm global bin directory
npm config get prefix

# Add to PATH if needed
export PATH="$(npm config get prefix)/bin:$PATH"
```

### Version Conflicts

```bash
# Check installed version
spark-id --version

# Update to latest version
npm update -g @aexoo-ai/spark-id

# Or reinstall
npm uninstall -g @aexoo-ai/spark-id
npm install -g @aexoo-ai/spark-id
```

### Network Issues

```bash
# Use a different registry
npm config set registry https://registry.npmjs.org/

# Use a proxy if needed
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

## Verification

### Test Basic Functionality

```bash
# Generate a simple ID
spark-id
# Should output: ybndrfg8ejkmcpqxot1uwisza345h769

# Generate with prefix
spark-id -p USER
# Should output: USER_ybndrfg8ejkmcpqxot1uwisza345h769

# Validate an ID
spark-id -v USER_ybndrfg8ejkmcpqxot1uwisza345h769
# Should output: true
```

### Test Advanced Features

```bash
# Generate multiple IDs
spark-id -c 5
# Should output 5 different IDs

# Parse an ID
spark-id --parse USER_ybndrfg8ejkmcpqxot1uwisza345h769
# Should output JSON with parsed components

# JSON output
spark-id -p USER --json
# Should output JSON format
```

## Uninstallation

### Remove Global Installation

```bash
# Using npm
npm uninstall -g @aexoo-ai/spark-id

# Using pnpm
pnpm remove -g @aexoo-ai/spark-id

# Using yarn
yarn global remove @aexoo-ai/spark-id
```

### Remove Local Installation

```bash
# Remove from project
npm uninstall @aexoo-ai/spark-id

# Or remove from package.json and run
npm install
```

### Remove Development Installation

```bash
# Unlink global installation
npm unlink -g @aexoo-ai/spark-id

# Remove from project
npm unlink @aexoo-ai/spark-id
```

## Related

- [CLI Overview](/cli/) - Command-line interface overview
- [Usage](/cli/usage) - How to use the CLI
- [Options](/cli/options) - All available options
- [Getting Started](/guide/getting-started) - Library installation
