var fs = require("fs")
var path = require("path")
const data = require("./content/data.json")
// In newer Node.js versions where process is already global this isn't necessary.
var process = require("process")
const StreamZip = require("node-stream-zip")

// Loop through all the files in the temp directory
function getFilesizeInBytes(filename) {
  var stats = fs.statSync(filename)
  var fileSizeInBytes = stats["size"]
  return fileSizeInBytes
}
const readDir = async () => {
  fs.readdir("./dump", function(err, files) {
    if (err) {
      console.error("Could not list the directory.", err)
      process.exit(1)
    }
    const ziptest = /\.zip+$/i
    files.forEach(async (file, index) => {
      if (ziptest.test(file.toLowerCase()) && file !== "demos.zip") {
        const zip = new StreamZip({
          file: `./dump/${file}`,
          storeEntries: true,
        })
        entries = await getEntries(zip)
        let found = false
        let command = ""
        const filename = file
          .split(".")
          .slice(0, -1)
          .join(".")
        entries.map(entry => {
          var strRegExPattern = `^${filename.toLowerCase()}\.(exe|com|bat)$`
          if (
            entry.file.toLowerCase().match(new RegExp(strRegExPattern, "gi"))
          ) {
            console.log("Here we go: " + entry.file)
            found = true
            command = entry.file
          }
        })
        if (!found) {
          const exetest = /\.exe$/i
          entries.map(entry => {
            if (exetest.test(entry.file.toLowerCase())) {
              console.log("EXE we go: " + entry.file)
              found = true
              command = entry.file
            }
          })
          if (!found) {
            const comtest = /\.com$/i
            entries.map(entry => {
              if (comtest.test(entry.file.toLowerCase())) {
                console.log("COM we go: " + entry.file)
                found = true
                command = entry.file
              }
            })
            if (!found) {
              const battest = /\.com$/i
              entries.map(entry => {
                if (battest.test(entry.file.toLowerCase())) {
                  console.log("BAT we go: " + entry.file)
                  found = true
                  command = entry.file
                }
              })
            }
          }
        }
        if (found) {
          let alreadyProcessed = data.find(demo => demo.file === file)
          if (!alreadyProcessed) {
            const filedata = {
              file: filename,
              title: filename,
              link: filename,
              command: command,
              keypresses: null,
              size: getFilesizeInBytes("./dump/" + file),
              cycles: 24000,
              screenshot: null,
              nsfw: false,
              description: "",
              tags: [],
            }
            console.log({ filedata })
            data.push(filedata)
            let dataString = JSON.stringify(data)
            fs.writeFileSync("./content/data.json", dataString)
            fs.renameSync(`./dump/${file}`, `./static/demos/zipped/${file}`)
          }
        }
      }
    })
  })
}

const getEntries = async zip => {
  return (promise = new Promise((resolve, reject) => {
    zip.on("ready", async () => {
      const entries = []
      for (const entry of Object.values(zip.entries())) {
        if (!entry.isDirectory && !/__MACOSX/g.test(entry.name)) {
          let found = data.find(demo => demo.file === entry.name)
          if (!found) {
            found = {
              file: entry.name,
              size: entry.size,
            }
            entries.push(found)
          }
        }
      }
      resolve(entries)
      zip.close()
    })
  }))
}
const runMe = async () => {
  //   const entries = await readDir()
  //   console.log({ entries })
  //   entries.map(entry => {
  //     console.log("FINAL FILE: " + entry.file)
  //     console.log("FINAL COMMAND: " + entry.command)
  //     console.log("FINAL SIZE: " + entry.size)
  //   })
}
readDir()
