const config = require("config")
const got = require("got")

const initInvestmentsClient = () => {
  const getInvestments = async () => {
    try {
      const response = await got
        .get(`${config.investmentsServiceUrl}/investments`)
        .json()

      return response
    } catch (e) {
      throw new Error(`Request Error: ${e.message}`)
    }
  }

  const getInvestmentsById = async (id) => {
    try {
      const response = await got
        .get(`${config.investmentsServiceUrl}/investments/${id}`)
        .json()

      return response
    } catch (e) {
      throw new Error(`Request Error: ${e.message}`)
    }
  }

  const exportCsv = async (data) => {
    try {
      const response = await got.post(
        `${config.investmentsServiceUrl}/investments/export`,
        {json: {data}},
      )

      return response
    } catch (e) {
      throw new Error(`Request Error: ${e.message}`)
    }
  }

  return {
    getInvestments,
    getInvestmentsById,
    exportCsv,
  }
}

module.exports = initInvestmentsClient
