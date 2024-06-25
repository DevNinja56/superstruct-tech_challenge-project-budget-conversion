const express = require('express')
const { getBudgetDetailsController, createProjectBudgetController, getProjectBudgetByIdController, updateProjectByIdController, deleteProjectByIdController, getAllProjectsController, budgetConversionController } = require('./controllers/projectBudgetController')

const endpoints = express.Router()

endpoints.get('/ok', (req, res) => {
  res.status(200).json({ ok: true })
})

endpoints.post('/project/budget/currency', getBudgetDetailsController)
endpoints.post('/project/budget', createProjectBudgetController)
endpoints.get('/project/budget/:id', getProjectBudgetByIdController)
endpoints.put('/project/budget/:id', updateProjectByIdController)
endpoints.delete('/project/budget/:id', deleteProjectByIdController)
endpoints.get('/project/budget', getAllProjectsController)
endpoints.get('/api-conversion', budgetConversionController)

module.exports = endpoints
