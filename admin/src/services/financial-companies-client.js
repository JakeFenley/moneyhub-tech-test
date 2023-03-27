const config = require("config")
const got = require("got")

const initFinancialCompaniesClient = () => {
  const getCompanies = async () => {
    try {
      const response = await got
        .get(`${config.financialCompaniesServiceUrl}/companies`)
        .json()

      return response
    } catch (e) {
      throw new Error(`Request Error: ${e.message}`)
    }
  }

  const getCompanyById = async (id) => {
    try {
      const response = await got
        .get(`${config.financialCompaniesServiceUrl}/companies/${id}`)
        .json()

      return response
    } catch (e) {
      throw new Error(`Request Error: ${e.message}`)
    }
  }

  return {
    getCompanies,
    getCompanyById,
  }
}

module.exports = initFinancialCompaniesClient
