const MOCK_DATA = require('./mockData')

function seedTestDataToSqlite (db) {
  // Create the projects table
  db.serialize(function () {
    db.run(`CREATE TABLE IF NOT EXISTS project (
      projectId INTEGER PRIMARY KEY,
      projectName TEXT,
      year INTEGER,
      currency TEXT,
      initialBudgetLocal REAL,
      budgetUsd REAL,
      initialScheduleEstimateMonths INTEGER,
      adjustedScheduleEstimateMonths INTEGER,
      contingencyRate REAL,
      escalationRate REAL,
      finalBudgetUsd REAL
    )`, function (err) {
      if (err) {
        console.error('Error creating table:', err.message)
      } else {
        console.log("Table 'projects' created successfully")
      }
    })

    // Insert each project item into the projects table
    MOCK_DATA.forEach(function (project) {
      const insertQuery = `INSERT INTO project (
        projectId,
        projectName,
        year,
        currency,
        initialBudgetLocal,
        budgetUsd,
        initialScheduleEstimateMonths,
        adjustedScheduleEstimateMonths,
        contingencyRate,
        escalationRate,
        finalBudgetUsd
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

      db.run(insertQuery, [
        project.projectId,
        project.projectName,
        project.year,
        project.currency,
        project.initialBudgetLocal,
        project.budgetUsd,
        project.initialScheduleEstimateMonths,
        project.adjustedScheduleEstimateMonths,
        project.contingencyRate,
        project.escalationRate,
        project.finalBudgetUsd
      ], function (err) {
        if (err) {
          console.error('Error inserting item:', err.message)
        } else {
          console.log('Mock Data item inserted successfully')
        }
      })
    })
  })
}

module.exports = { seedTestDataToSqlite }
