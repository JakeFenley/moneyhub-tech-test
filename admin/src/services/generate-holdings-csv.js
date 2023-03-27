const R = require("ramda")

const fromArrayToCsvString = (data) => {
  const headers = Object.keys(data[0])
  const rows = R.map(R.props(headers))(data)
  const csvArr = [headers].concat(rows)
  const csvString = R.pipe(R.map(R.join(",")), R.join("\n"))(csvArr)

  return csvString
}

const generateHoldingsCsvData = async (
  financialCompaniesClient,
  investmentsClient,
) => {
  const [investments, companiesData] = await Promise.all([
    investmentsClient.getInvestments(),
    financialCompaniesClient.getCompanies(),
  ])

  const companies = companiesData.reduce((acc, company) => {
    acc[company.id] = company.name

    return acc
  }, {})

  const holdings = investments.reduce((acc, investment) => {
    investment.holdings.forEach((holding) => {
      acc.push({
        User: investment.userId,
        "First Name": investment.firstName,
        "Last Name": investment.lastName,
        Date: investment.date,
        Holding: companies[holding.id],
        Value: investment.investmentTotal * holding.investmentPercentage,
      })
    })

    return acc
  }, [])

  return fromArrayToCsvString(holdings)
}

module.exports = generateHoldingsCsvData
