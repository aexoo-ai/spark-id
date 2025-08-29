import { defineConfig } from 'vitepress'

export default defineConfig({
    title: 'Spark-ID',
    description: 'Cryptographically secure, URL-safe ID generator with prefix support',
    lang: 'en-US',
    base: '/spark-id/',

    // Enable strict link checking to catch 404s
    markdown: {
        linkCheck: 'error'
    },

    themeConfig: {
        logo: {
            light: '/logo.svg',
            dark: '/logo-dark.svg'
        },
        siteTitle: 'Spark-ID',

        nav: [
            { text: 'Guide', link: '/guide/getting-started' },
            { text: 'API', link: '/api/' },
            { text: 'Examples', link: '/examples/' },
            { text: 'CLI', link: '/cli/' },
            { text: 'GitHub', link: 'https://github.com/aexoo-ai/spark-id' }
        ],

        sidebar: {
            '/guide/': [
                {
                    text: 'Getting Started',
                    items: [
                        { text: 'Introduction', link: '/guide/getting-started' },
                        { text: 'Installation', link: '/guide/installation' },
                        { text: 'Quick Start', link: '/guide/quick-start' }
                    ]
                },
                {
                    text: 'Core Concepts',
                    items: [
                        { text: 'ID Generation', link: '/guide/id-generation' },
                        { text: 'Prefixes', link: '/guide/prefixes' },
                        { text: 'Validation', link: '/guide/validation' },
                        { text: 'Configuration', link: '/guide/configuration' },
                        { text: 'Security', link: '/guide/security' }
                    ]
                }
            ],
            '/api/': [
                {
                    text: 'API Reference',
                    items: [
                        { text: 'Overview', link: '/api/' },
                        { text: 'Functions', link: '/api/functions' },
                        { text: 'Classes', link: '/api/classes' },
                        { text: 'Types', link: '/api/types' }
                    ]
                }
            ],
            '/examples/': [
                {
                    text: 'Examples',
                    items: [
                        { text: 'Overview', link: '/examples/' },
                        { text: 'Basic Usage', link: '/examples/basic' },
                        { text: 'TypeScript', link: '/examples/typescript' },
                        { text: 'Database Integration', link: '/examples/database' },
                        { text: 'Web API', link: '/examples/web-api' }
                    ]
                }
            ],
            '/cli/': [
                {
                    text: 'Command Line',
                    items: [
                        { text: 'Overview', link: '/cli/' },
                        { text: 'Installation', link: '/cli/installation' },
                        { text: 'Usage', link: '/cli/usage' },
                        { text: 'Options', link: '/cli/options' }
                    ]
                }
            ]
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/aexoo-ai/spark-id' }
        ],

        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2025 ÆXꝎ'
        },

        search: {
            provider: 'local'
        }
    },

    head: [
        // Basic favicon
        ['link', { rel: 'icon', href: '/spark-id/logo.svg', type: 'image/svg+xml' }],
        ['link', { rel: 'icon', href: '/spark-id/favicon.ico', sizes: 'any' }],

        // Apple touch icons
        ['link', { rel: 'apple-touch-icon', href: '/spark-id/favicon/apple-touch-icon.png' }],
        ['link', { rel: 'apple-touch-icon', href: '/spark-id/favicon/apple-touch-icon-152x152.png', sizes: '152x152' }],
        ['link', { rel: 'apple-touch-icon', href: '/spark-id/favicon/apple-touch-icon-167x167.png', sizes: '167x167' }],

        // Android icons
        ['link', { rel: 'icon', href: '/spark-id/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' }],
        ['link', { rel: 'icon', href: '/spark-id/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }],

        // Microsoft tiles
        ['meta', { name: 'msapplication-TileColor', content: '#646cff' }],
        ['meta', { name: 'msapplication-TileImage', content: '/spark-id/favicon/mstile-144x144.png' }],
        ['meta', { name: 'msapplication-config', content: '/spark-id/browserconfig.xml' }],

        // Safari pinned tab
        ['link', { rel: 'mask-icon', href: '/spark-id/favicon/safari-pinned-tab.svg', color: '#646cff' }],

        // Web app manifest
        ['link', { rel: 'manifest', href: '/spark-id/site.webmanifest' }],

        // Theme colors
        ['meta', { name: 'theme-color', content: '#646cff' }],
        ['meta', { name: 'msapplication-TileColor', content: '#646cff' }]
    ]
})
