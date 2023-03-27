const express = require("express")
const bodyParser = require("body-parser")
const config = require("config")
const investments = require("./data")
const R = require("ramda")
const path = require("path")
const {promisify} = require("util")
const fs = require("fs")
const mkdir = promisify(fs.mkdir)
const exists = promisify(fs.exists)
const writeFile = promisify(fs.writeFile)

const app = express()

app.use(bodyParser.json({limit: "10mb"}))

app.get("/investments", (req, res) => {
  res.send(investments)
})

app.get("/investments/:id", (req, res) => {
  const {id} = req.params
  const investment = R.filter(R.propEq("id", id), investments)
  res.send(investment)
})

app.post("/investments/export", async (req, res) => {
  console.log("Body received", req.body)

  try {
    const dirExists = await exists(path.join(__dirname, "/files"))

    if (!dirExists) {
      await mkdir(path.join(__dirname, "/files"))
    }

    await writeFile(
      path.join(
        __dirname,
        `/files/${new Date().toISOString().replace(/[:T.]/g, "-")}.csv`,
      ),
      req.body.data,
    )
    res.sendStatus(204)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

app.listen(config.port, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err)
    process.exit(1)
  }
  console.log(`Server running on port ${config.port}`)
})
