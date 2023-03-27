const express = require("express")
const bodyParser = require("body-parser")
const config = require("config")
const got = require("got")
const {generateHoldingsCsvData} = require("./services/generate-holdings-csv")
const initFinancialCompaniesClient = require("./services/financial-companies-client")
const initInvestmentsClient = require("./services/investments-client")

const app = express()

app.use(bodyParser.json({limit: "10mb"}))

const financialCompaniesClient = initFinancialCompaniesClient()
const investmentsClient = initInvestmentsClient()

app.post("/holdings", async (_req, res) => {
  try {
    const csvData = await generateHoldingsCsvData(
      financialCompaniesClient,
      investmentsClient,
    )

    const exportResponse = await investmentsClient.exportCsv(csvData)

    res.sendStatus(exportResponse.statusCode)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

app.get("/investments/:id", async (req, res) => {
  const {id} = req.params

  try {
    const data = await got
      .get(`${config.investmentsServiceUrl}/investments/${id}`)
      .json()

    res.json(data)
  } catch (e) {
    console.error(e)
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

module.exports = app
