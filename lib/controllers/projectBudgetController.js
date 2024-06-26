const { CONVERSION_API_PROJECT_NAMES } = require('../constants')
const { getBudgetDetails, getAllProjects, getProjectBudgetById, createProjectBudget, updateProjectById, deleteProjectById, budgetConversion } = require('../services/projectBudgetService')

async function getAllProjectsController (req, res) {
  try {
    const result = await getAllProjects()
    res.json(result)
  } catch (err) {
    res.status(err?.statusCode || 500).json({ success: false, err: err.message })
  }
}

async function getProjectBudgetByIdController (req, res) {
  try {
    const projectId = req.params.id
    const result = await getProjectBudgetById(projectId)
    res.json(result)
  } catch (err) {
    res.status(err?.statusCode || 500).json({ success: false, err: err.message })
  }
}

async function updateProjectByIdController (req, res) {
  try {
    const id = req.params.id
    const { projectId, ...update } = req.body
    const result = await updateProjectById(id, update)
    res.json(result)
  } catch (err) {
    res.status(err?.statusCode || 500).json({ success: false, err: err.message })
  }
}
async function deleteProjectByIdController (req, res) {
  try {
    const id = req.params.id
    const result = await deleteProjectById(id)
    res.json(result)
  } catch (err) {
    res.status(err?.statusCode || 500).json({ success: false, err: err.message })
  }
}

async function createProjectBudgetController (req, res) {
  try {
    const { projectName, year, projectId } = req.body

    if (!projectId || !projectName || !year) {
      throw Object.assign(new Error('Provide correct form data'), { statusCode: 400 })
    }

    const result = await createProjectBudget({ ...req.body })
    res.status(201).json(result)
  } catch (err) {
    res.status(err?.statusCode || 500).json({ success: false, err: err.message })
  }
}

async function getBudgetDetailsController (req, res) {
  try {
    const { year, projectName } = req.body

    if (!year || !projectName) {
      return res.status(400).json({
        success: false,
        err: 'Provide correct form data'
      })
    }
    const result = await getBudgetDetails({ ...req.body })

    res.json(result)
  } catch (err) {
    res.status(err?.statusCode || 500).json({ success: false, err: err.message })
  }
}

async function budgetConversionController (req, res) {
  try {
    const result = await budgetConversion(CONVERSION_API_PROJECT_NAMES)
    res.json(result)
  } catch (err) {
    res.status(err?.statusCode || 500).json({ success: false, err: err.message })
  }
}

module.exports = {
  getAllProjectsController,
  getBudgetDetailsController,
  getProjectBudgetByIdController,
  createProjectBudgetController,
  updateProjectByIdController,
  deleteProjectByIdController,
  budgetConversionController
}
