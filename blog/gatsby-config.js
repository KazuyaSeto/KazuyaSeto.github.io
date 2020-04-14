module.exports = {
  pathPrefix: '/blog/public',
  plugins: [
    {
      resolve: `gatsby-theme-blog`,
      options: {},
    },
  ],
  // Customize your site metadata:
  siteMetadata: {
    title: `スタプリブログ`,
    author: `Kazuya Seto`,
    description: `ゲーム開発に関連するあれやこれや`,
    social: [
      {
        name: `twitter`,
        url: `https://twitter.com/_seto_`,
      },
      {
        name: `github`,
        url: `https://github.com/kazuyaseto`,
      },
    ],
  },
}
