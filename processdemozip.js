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
    rimraf.sync("./dump/extracted")
    fs.mkdirSync("./dump/extracted")
    zip.extract(null, "./dump/extracted", (err, count) => {
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
          const filename = entry.name
            .split(".")
            .slice(0, -1)
            .join(".")
          if (
            !fs.existsSync(__dirname + `/static/demos/zipped/${filename}.zip`)
          ) {
            var output = fs.createWriteStream(
              __dirname + `/static/demos/zipped/${filename}.zip`
            )
            output.on("close", function() {
              fs.unlink(`./dump/extracted/${entry.name}`, () => {})
            })
            var archive = archiver("zip", {
              zlib: { level: 9 }, // Sets the compression level.
            })
            archive.pipe(output)
            console.log(entry.name)
            archive.file(`./dump/extracted/${entry.name}`, {
              name: entry.name,
            })
            archive.finalize()
          } else {
            fs.unlink(`./dump/extracted/${entry.name}`, () => {})
          }
          let found = data.find(demo => demo.file === filename)
          if (!found) {
            found = {
              file: filename,
              title: filename,
              link: filename,
              command: entry.name,
              keypresses: null,
              size: entry.size,
              cycles: 24000,
              screenshot: null,
              nsfw: false,
              description: "",
              tags: [],
            }
            data.push(found)
          }
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
const run = async () => {
  if (fs.existsSync("./dump/demos.zip")) {
    const zip = new StreamZip({
      file: "./dump/demos.zip",
      storeEntries: true,
    })
    await getEntries(zip)
    // rimraf.sync("./dump/extracted")
    if (!fs.existsSync("./dump/done/")) {
      fs.mkdirSync("./dump/done/")
    }
    fs.renameSync("./dump/demos.zip", "./dump/done/demos.zip")
  }
}
run()
