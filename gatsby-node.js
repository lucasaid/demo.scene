/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const data = require("./content/data.json")
const fs = require("fs")
const rimraf = require("rimraf")
const StreamZip = require("node-stream-zip")
const archiver = require("archiver")
const unzip = async zip => {
  return (promise = new Promise((resolve, reject) => {
    rimraf.sync("./static/demos/extracted")
    fs.mkdirSync("./static/demos/extracted")
    zip.extract(null, "./static/demos/extracted", (err, count) => {
      console.log(err ? "Extract error" : `Extracted ${count} entries`)
      resolve()
    })
  }))
}

const getEntries = async zip => {
  return (promise = new Promise((resolve, reject) => {
    zip.on("ready", async () => {
      // Take a look at the files
      await unzip(zip)
      let entries = []
      console.log("Entries read: " + zip.entriesCount)
      for (const entry of Object.values(zip.entries())) {
        const desc = entry.isDirectory ? "directory" : `${entry.size} bytes`
        console.log(`Entry ${entry.name}: ${desc}`)
        if (!entry.isDirectory && !/__MACOSX/g.test(entry.name)) {
          if (!fs.existsSync("./static/demos/zipped/")) {
            fs.mkdirSync("./static/demos/zipped/")
          }
          if (
            !fs.existsSync(__dirname + `/static/demos/zipped/${entry.name}.zip`)
          ) {
            var output = fs.createWriteStream(
              __dirname + `/static/demos/zipped/${entry.name}.zip`
            )
            output.on("close", function() {
              fs.unlink(`./static/demos/extracted/${entry.name}`, () => {})
            })
            var archive = archiver("zip", {
              zlib: { level: 9 }, // Sets the compression level.
            })
            archive.pipe(output)
            archive.file(`./static/demos/extracted/${entry.name}`, {
              name: entry.name,
            })
            archive.finalize()
          } else {
            fs.unlink(`./static/demos/extracted/${entry.name}`, () => {})
          }
          let found = data.find(demo => demo.file === entry.name)
          if (!found) {
            found = {
              file: entry.name,
              link: entry.name,
              command: entry.name,
              keypresses: null,
              size: entry.size,
              cycles: 24000,
              screenshot: null,
            }
            data.push(found)
          }
          // entries.push({
          //   file: found.file,
          //   link: found.file,
          //   command: found.command,
          //   keypresses: found.keypresses,
          //   size: found.size ? found.size : null,
          // })
        }
      }
      let dataString = JSON.stringify(data)
      fs.writeFileSync("./content/data.json", dataString)
      resolve(data)

      // Do not forget to close the file once you're done
      zip.close()
    })
  }))
}
exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  // We'll make the newNode object here for clarity
  const zip = new StreamZip({
    file: "./static/demos/demos.zip",
    storeEntries: true,
  })
  const entries = await getEntries(zip)

  entries.map(entry => {
    actions.createNode({
      ...entry,
      keypresses: entry.keypresses
        ? {
            timing: entry.keypresses.timing,
            keys: entry.keypresses.keys,
          }
        : null,
      id: createNodeId(`DemoNode-${entry.file}`), // required by Gatsby
      internal: {
        type: "DemoNode", // required by Gatsby
        contentDigest: createContentDigest(entry.file), // required by Gatsby, must be unique
      },
    })
    actions.createPage({
      path: entry.link,
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
        link: String!,
        command: String!,
        keypresses: Keypress,
        size: String!,
        cycles: String!,
        screenshot: String!,
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
