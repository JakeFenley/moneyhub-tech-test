const generateHoldingsCsvData = require("../../../src/services/generate-holdings-csv")
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

  it("should be correct", async () => {
    const financialCompaniesClient = initFinancialCompanies()
    const investmentsClient = initInvestmentsClient()

    financialCompaniesClient.getCompanies.mockReturnValue(companiesFixture)
    investmentsClient.getInvestments.mockReturnValue(investmentsFixture)

    generateHoldingsCsvData(financialCompaniesClient, investmentsClient)
  })
})
