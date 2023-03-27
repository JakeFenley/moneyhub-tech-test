const {
  generateHoldingsCsvData,
  getHoldings,
} = require("../../src/services/generate-holdings-csv")
const initFinancialCompanies = require("../../__mocks__/mocks/financial-companies-client")
const initInvestmentsClient = require("../../__mocks__/mocks/investments-client")
const {companiesFixture} = require("../../__mocks__/fixtures/companies")
const {investmentsFixture} = require("../../__mocks__/fixtures/investments")

describe("generate-holdings-csv", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("financialCompanies.getCompanies and investmentsClient.getInvestments should be called", async () => {
    const financialCompaniesClient = initFinancialCompanies()
    const investmentsClient = initInvestmentsClient()

    const financialCompaniesSpy = jest.spyOn(
      financialCompaniesClient,
      "getCompanies",
    )
    const investmentsSpy = jest.spyOn(investmentsClient, "getInvestments")

    financialCompaniesClient.getCompanies.mockReturnValue(companiesFixture)
    investmentsClient.getInvestments.mockReturnValue(investmentsFixture)

    generateHoldingsCsvData(financialCompaniesClient, investmentsClient)

    expect(financialCompaniesSpy).toHaveBeenCalled()
    expect(investmentsSpy).toHaveBeenCalled()
  })

  it("return value should be correct CSV string", async () => {
    const financialCompaniesClient = initFinancialCompanies()
    const investmentsClient = initInvestmentsClient()

    financialCompaniesClient.getCompanies.mockReturnValue(companiesFixture)
    investmentsClient.getInvestments.mockReturnValue(investmentsFixture)

    const result = await generateHoldingsCsvData(
      financialCompaniesClient,
      investmentsClient,
    )

    expect(result).toEqual(
      "User,First Name,Last Name,Date,Holding,Value\n1,Billy,Bob,2020-01-01,The Small Investment Company,1400\n2,Sheila,Aussie,2020-03-01,The Big Investment Company,10750\n2,Sheila,Aussie,2020-03-01,The Small Investment Company,6450\n2,Sheila,Aussie,2020-03-01,Capital Investments,4300\n3,John,Smith,2020-03-01,The Big Investment Company,120000\n3,John,Smith,2020-03-01,Capital Investments,30000",
    )
  })

  it("object should be built correctly for getHoldings", () => {
    const holdings = getHoldings(investmentsFixture, companiesFixture)

    expect(holdings).toEqual([
      {
        User: "1",
        "First Name": "Billy",
        "Last Name": "Bob",
        Date: "2020-01-01",
        Holding: "The Small Investment Company",
        Value: 1400,
      },
      {
        User: "2",
        "First Name": "Sheila",
        "Last Name": "Aussie",
        Date: "2020-03-01",
        Holding: "The Big Investment Company",
        Value: 10750,
      },
      {
        User: "2",
        "First Name": "Sheila",
        "Last Name": "Aussie",
        Date: "2020-03-01",
        Holding: "The Small Investment Company",
        Value: 6450,
      },
      {
        User: "2",
        "First Name": "Sheila",
        "Last Name": "Aussie",
        Date: "2020-03-01",
        Holding: "Capital Investments",
        Value: 4300,
      },
      {
        User: "3",
        "First Name": "John",
        "Last Name": "Smith",
        Date: "2020-03-01",
        Holding: "The Big Investment Company",
        Value: 120000,
      },
      {
        User: "3",
        "First Name": "John",
        "Last Name": "Smith",
        Date: "2020-03-01",
        Holding: "Capital Investments",
        Value: 30000,
      },
    ])

    expect(holdings[0].Value).toEqual(investmentsFixture[0].investmentTotal)
    expect(holdings[1].Value + holdings[2].Value + holdings[3].Value).toEqual(
      investmentsFixture[1].investmentTotal,
    )
    expect(holdings[4].Value + holdings[5].Value).toEqual(
      investmentsFixture[2].investmentTotal,
    )
  })
})
