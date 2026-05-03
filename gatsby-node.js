/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const data = require("./content/data.json")
const fs = require("fs")

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  data.map(entry => {
    actions.createNode({
      ...entry,
      keypresses: entry.keypresses
        ? {
            timing: entry.keypresses.timing,
            keys: entry.keypresses.keys,
          }
        : null,
      id: createNodeId(`DemoNode-${entry.file}`),
      internal: {
        type: "DemoNode",
        contentDigest: createContentDigest(entry.file),
      },
    })
  })
}

exports.createPages = async ({ actions }) => {
  data.map(entry => {
    actions.createPage({
      path: `/${entry.link}`,
      component: require.resolve("./src/templates/basicTemplate.tsx"),
      context: {
        ...entry,
      },
    })
  })
}
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
      """
      Markdown Node
      """
      type DemoNode implements Node @dontInfer {
        file: String!,
        title: String,
        link: String!,
        command: String!,
        keypresses: Keypress,
        size: String!,
        cycles: String!,
        screenshot: String,
        nsfw: Boolean,
        description: String,
        tags: [String],
      }

      """
      Keypress information
      """
      type Keypress {
        timing: String,
        keys: [Key],
      }

      """
      Key information
      """
      type Key {
        timing: String,
        key: String,
      }
    `
  createTypes(typeDefs)
}
