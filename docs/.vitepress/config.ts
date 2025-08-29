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
        logo: '/logo.svg',
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
        ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
        ['meta', { name: 'theme-color', content: '#646cff' }]
    ]
})
