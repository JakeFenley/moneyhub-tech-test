const initInvestmentsClient =
  require("../../../src/services/investments-client").default

jest.mock("../../../src/services/investments-client", () => ({
  __esModule: false,
  default: jest.fn().mockImplementation(() => ({
    getInvestments: jest.fn(),
  })),
}))

module.exports = initInvestmentsClient
