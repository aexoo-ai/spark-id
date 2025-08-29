#!/bin/bash

# Generate favicon files from the SVG logo
# This script uses ImageMagick to convert the SVG to various favicon formats

set -e

echo "🎨 Generating favicon files from SVG logo..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick is required but not installed."
    echo "Install with: sudo apt-get install imagemagick (Ubuntu/Debian)"
    echo "or: brew install imagemagick (macOS)"
    exit 1
fi

# Create output directory
mkdir -p docs/public/favicon

# Generate favicon.ico (16x16, 32x32, 48x48)
echo "📱 Generating favicon.ico..."
convert docs/public/logo.svg -resize 16x16 docs/public/favicon/favicon-16x16.png
convert docs/public/logo.svg -resize 32x32 docs/public/favicon/favicon-32x32.png
convert docs/public/logo.svg -resize 48x48 docs/public/favicon/favicon-48x48.png

# Combine into ICO file
convert docs/public/favicon/favicon-16x16.png docs/public/favicon/favicon-32x32.png docs/public/favicon/favicon-48x48.png docs/public/favicon.ico

# Generate Apple touch icons
echo "🍎 Generating Apple touch icons..."
convert docs/public/logo.svg -resize 180x180 docs/public/favicon/apple-touch-icon.png
convert docs/public/logo.svg -resize 152x152 docs/public/favicon/apple-touch-icon-152x152.png
convert docs/public/logo.svg -resize 167x167 docs/public/favicon/apple-touch-icon-167x167.png

# Generate Android icons
echo "🤖 Generating Android icons..."
convert docs/public/logo.svg -resize 192x192 docs/public/favicon/android-chrome-192x192.png
convert docs/public/logo.svg -resize 512x512 docs/public/favicon/android-chrome-512x512.png

# Generate Microsoft tiles
echo "🪟 Generating Microsoft tiles..."
convert docs/public/logo.svg -resize 144x144 docs/public/favicon/mstile-144x144.png
convert docs/public/logo.svg -resize 150x150 docs/public/favicon/mstile-150x150.png
convert docs/public/logo.svg -resize 310x150 docs/public/favicon/mstile-310x150.png
convert docs/public/logo.svg -resize 310x310 docs/public/favicon/mstile-310x310.png

# Generate Safari pinned tab icon (monochrome)
echo "🦁 Generating Safari pinned tab icon..."
convert docs/public/logo.svg -colorspace gray -resize 16x16 docs/public/favicon/safari-pinned-tab.svg

# Create web app manifest
echo "📋 Creating web app manifest..."
cat > docs/public/site.webmanifest << EOF
{
    "name": "Spark-ID Documentation",
    "short_name": "Spark-ID",
    "description": "Cryptographically secure, URL-safe ID generator with prefix support",
    "icons": [
        {
            "src": "/spark-id/favicon/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/spark-id/favicon/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
    "theme_color": "#646cff",
    "background_color": "#ffffff",
    "display": "standalone"
}
EOF

# Create browserconfig.xml for Microsoft tiles
echo "🪟 Creating browserconfig.xml..."
cat > docs/public/browserconfig.xml << EOF
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/spark-id/favicon/mstile-150x150.png"/>
            <TileColor>#646cff</TileColor>
        </tile>
    </msapplication>
</browserconfig>
EOF

echo "✅ Favicon generation complete!"
echo "📁 Files created in docs/public/favicon/"
echo "🔗 Update VitePress config to use these favicon files"
