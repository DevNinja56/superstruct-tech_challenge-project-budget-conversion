const { dbFactoryRead, dbFactoryCreate, dbFactoryUpdate, dbFactoryDelete } = require('./dbFactoryService')
const { getConversionRateForUsd } = require('../exchangeRate')
const toCamelCase = require('../utils/toCamelCase')
const roundToDecimalPlaces = require('../utils/roundToDecimalPlaces')

async function createProjectBudget (budgetToCreate) {
  const result = await dbFactoryCreate('project', budgetToCreate)
  return {
    success: true,
    data: result
  }
}

async function getProjectBudgetById (projectId) {
  const result = await dbFactoryRead('project', { projectId })
  if (!result || result.length < 1) {
    throw Object.assign(new Error(`Project with id ${projectId} does not exist`), { statusCode: 404 })
  }
  return {
    success: true,
    data: result[0]
  }
}

async function updateProjectById (projectId, dataToUpdate) {
  const result = await dbFactoryUpdate('project', { ...dataToUpdate }, { projectId })
  return {
    success: true,
    data: result
  }
}

async function deleteProjectById (projectId) {
  const result = await dbFactoryDelete('project', { projectId })
  return {
    success: true,
    data: result
  }
}

async function getBudgetDetails ({ year, projectName, currency = 'USD' }) {
  const results = await dbFactoryRead('project', { year, projectName })
  const exchangeRateForCurrency = currency === 'USD' ? 1 : await getConversionRateForUsd(currency)

  const finalDataToReturn = results.map(item => {
    const convertedAmount = roundToDecimalPlaces(item.finalBudgetUsd * exchangeRateForCurrency)
    const newProperty =
      currency !== 'USD'
        ? { [`finalBudget${toCamelCase(currency)}`]: convertedAmount }
        : {}
    return { ...item, ...newProperty }
  })

  return {
    success: true,
    data: finalDataToReturn
  }
}

async function getAllProjects () {
  const result = await dbFactoryRead('project', {})
  return {
    success: true,
    data: result
  }
}

module.exports = {
  getBudgetDetails,
  getAllProjects,
  getProjectBudgetById,
  createProjectBudget,
  updateProjectById,
  deleteProjectById
}
