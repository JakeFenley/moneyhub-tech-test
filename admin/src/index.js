const express = require("express")
const bodyParser = require("body-parser")
const config = require("config")
const got = require("got")
const app = express()

app.use(bodyParser.json({limit: "10mb"}))

app.get("/investments/:id", async (req, res) => {
  const {id} = req.params

  try {
    const data = await got
      .get(`${config.investmentsServiceUrl}/investments/${id}`)
      .json()

    res.json(data)
  } catch (e) {
    console.error(e)
    res.send(500)
  }
})

app.listen(config.port, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err)
    process.exit(1)
  }
  console.log(`Server running on port ${config.port}`)
})
