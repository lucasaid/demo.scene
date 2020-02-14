const puppeteer = require("puppeteer")
const data = require("./content/data.json")
const fs = require("fs")
const minimist = require("minimist")

let args = minimist(process.argv.slice(2), {
  default: {
    a: false,
    t: 2000,
    d: null,
  },
})
const genScreen = async demo => {
  if (
    !fs.existsSync(`./static/screenshots/${demo.link}.png`) ||
    args.a ||
    (args.d && args.d.replace("\\", "") === demo.link)
  ) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(`http://localhost:8000/${demo.link}`)
    await page.waitFor(parseInt(args.t, 10))
    await page.screenshot({ path: `./static/screenshots/${demo.link}.png` })
    await browser.close()
    console.log(`CREATED: '/screenshots/${demo.link}.png'`)
  }
  return `/screenshots/${demo.link}.png`
}
;(async () => {
  if (!fs.existsSync("./static/screenshots/")) {
    fs.mkdirSync("./static/screenshots/")
  }
  for (const demo of data) {
    const screen = await genScreen(demo)
    demo.screenshot = screen
  }
  let dataString = JSON.stringify(data)
  fs.writeFileSync("./content/data.json", dataString)
})()
