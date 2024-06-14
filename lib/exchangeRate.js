const config = require('../config')

async function getConversionRateForUsd (targetCurrency) {
  const apiKey = config.currency.apiKey
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
  try {
    const responseSnap = await fetch(url)
    const response = await responseSnap.json()
    const exchangeRates = response.conversion_rates
    if (!(targetCurrency in exchangeRates)) {
      throw new Error(`Currency ${targetCurrency} is not supported or not found in the response`)
    }
    return exchangeRates[targetCurrency]
  } catch (error) {
    return `Error occurred: ${error.message}`
  }
}

module.exports = { getConversionRateForUsd }
