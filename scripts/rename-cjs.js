#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');

// Files to rename to .cjs
const filesToRename = ['index.js', 'spark-id.js', 'cli.js', 'types.js'];

// Rename files
filesToRename.forEach((file) => {
  const jsPath = path.join(distDir, file);
  const cjsPath = path.join(distDir, file.replace('.js', '.cjs'));

  if (fs.existsSync(jsPath)) {
    // Copy the file content and modify for CommonJS
    const content = fs.readFileSync(jsPath, 'utf8');

    // Convert ES module exports to CommonJS
    let cjsContent = content
      .replace(
        /export \* from ['"]([^'"]+)['"];?/g,
        'module.exports = require("$1");'
      )
      .replace(
        /export \{([^}]+)\} from ['"]([^'"]+)['"];?/g,
        (match, exports, module) => {
          const exportNames = exports.split(',').map((e) => e.trim());
          return exportNames
            .map(
              (name) => `module.exports.${name} = require("${module}").${name};`
            )
            .join('\n');
        }
      )
      .replace(/export default ([^;]+);?/g, 'module.exports = $1;')
      .replace(/export const ([^=]+) = ([^;]+);?/g, 'module.exports.$1 = $2;')
      .replace(/export class ([^{]+) {/g, 'class $1 {')
      .replace(/export function ([^(]+)\(/g, 'function $1(')
      .replace(/export \{([^}]+)\};?/g, (match, exports) => {
        const exportNames = exports.split(',').map((e) => e.trim());
        return exportNames
          .map((name) => `module.exports.${name} = ${name};`)
          .join('\n');
      });

    fs.writeFileSync(cjsPath, cjsContent);
    console.log(`✅ Created ${file.replace('.js', '.cjs')}`);
  }
});

console.log('🎉 CommonJS files created successfully!');
