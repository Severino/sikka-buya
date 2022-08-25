const { description } = require('../../package')

module.exports = {
  host: 'localhost',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Sikka Buya Developer Docs',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],
  extraWatchFiles: [
    "../index.md"
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    sidebarDepth: 2,
    nav: [
      {
        text: 'Docs',
        link: '/docs/',
      },
    ],
    sidebar:
      [
        ["/docs/", "Introduction"],
        {
          title: "Setup",
          collapsable: false,
          path: '/docs/setup/'
        },
        {
          title: "Deployment",
          collapsable: false,
          path: '/docs/deployment/'
        },
        {
          title: "Backend",
          collapsable: false,
          path: '/docs/backend/'
        },
        {
          title: "GraphQL",
          collapsable: false,
          path: '/docs/graphql/'
        },
        {
          title: "Frontend",
          collapsable: false,
          path: '/docs/frontend/'
        },
        {
          title: "Database",
          collapsable: false,
          path: '/docs/database/'
        }
      ]

  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
