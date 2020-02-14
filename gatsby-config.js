module.exports = {
  siteMetadata: {
    title: `DEMO SCENE`,
    description: `BBS Demos from old.`,
    author: `Chris`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `demo.scene`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#7fdbff`,
        theme_color: `#7fdbff`,
        display: `minimal-ui`,
      },
    },
    `gatsby-plugin-sass`,
    `gatsby-plugin-typescript`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
