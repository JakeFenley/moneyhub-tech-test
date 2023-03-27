const initFinancialCompanies =
  require("../../../src/services/financial-companies-client").default

jest.mock("../../../src/services/financial-companies-client", () => ({
  __esModule: false,
  default: jest.fn().mockImplementation(() => ({
    getCompanies: jest.fn(),
    getCompanyById: jest.fn(),
  })),
}))

module.exports = initFinancialCompanies
