const R = require("ramda")

const fromArrayToCsvString = (data) => {
  const headers = Object.keys(data[0])
  const rows = R.map(R.props(headers))(data)
  const csvArr = [headers].concat(rows)
  const csvString = R.pipe(R.map(R.join(",")), R.join("\n"))(csvArr)

  return csvString
}

const getHoldings = (investmentsData, companiesData) => {
  const companies = companiesData.reduce((acc, company) => {
    acc[company.id] = company.name

    return acc
  }, {})

  const holdings = investmentsData.reduce((acc, investment) => {
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

  return holdings
}

const generateHoldingsCsvData = async (
  financialCompaniesClient,
  investmentsClient,
) => {
  const [investments, companies] = await Promise.all([
    investmentsClient.getInvestments(),
    financialCompaniesClient.getCompanies(),
  ])

  const holdings = getHoldings(investments, companies)

  return fromArrayToCsvString(holdings)
}

module.exports = {generateHoldingsCsvData, getHoldings}
