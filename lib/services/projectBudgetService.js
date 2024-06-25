const { dbFactoryRead, dbFactoryCreate, dbFactoryUpdate, dbFactoryDelete } = require('./dbFactoryService')
const { getConversionRateForUsd } = require('../exchangeRate')
const toCamelCase = require('../utils/toCamelCase')
const roundToDecimalPlaces = require('../utils/roundToDecimalPlaces')
const { executeQuery } = require('../db')

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

  if (!result?.changedRows && result.changedRows < 1) {
    throw Object.assign(new Error(`Project with id ${projectId} does not exist`), { statusCode: 404 })
  }

  return {
    success: true,
    data: result
  }
}

async function deleteProjectById (projectId) {
  const result = await dbFactoryDelete('project', { projectId })

  if (!result?.changedRows && result.changedRows < 1) {
    throw Object.assign(new Error(`Project with id ${projectId} does not exist`), { statusCode: 404 })
  }

  return {
    success: true,
    data: `Project withh id ${projectId} deleted successfully`
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

async function budgetConversion (projectNames) {
  const results = await new Promise((resolve, reject) => {
    const query = `SELECT * FROM project WHERE LOWER(projectName) IN (${projectNames.map(() => '?').join(',')})`

    executeQuery(query, projectNames?.map(name => name.toLowerCase()), (err, results) => {
      if (err) return reject(new Error(`Error reading data: ${err.message}`))
      resolve(results)
    })
  })

  const conversionRate = await getConversionRateForUsd('TTD')

  const finalResults = results.map(pb => {
    if (pb.currency === 'TTD') {
      return pb
    }

    return {
      ...pb,
      currency: 'TTD',
      initialBudgetLocal: roundToDecimalPlaces(pb.budgetUsd * conversionRate),
      finalBudgetTtd: roundToDecimalPlaces(pb.finalBudgetUsd * conversionRate)
    }
  })

  return {
    success: true,
    data: finalResults
  }
}

module.exports = {
  getBudgetDetails,
  getAllProjects,
  getProjectBudgetById,
  createProjectBudget,
  updateProjectById,
  deleteProjectById,
  budgetConversion
}
