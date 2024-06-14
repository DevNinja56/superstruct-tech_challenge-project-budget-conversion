const { executeQuery } = require('../db')

function dbFactoryCreate (table, data) {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO ${table} (${Object.keys(data).join(', ')}) VALUES (${Object.values(data).map(value => `'${value}'`).join(', ')})`
    executeQuery(query, [], (err, results) => {
      if (err) return reject(new Error(`Error creating data: ${err.message}`))
      resolve({ ...data })
    })
  })
}

function dbFactoryRead (table, conditions = {}) {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM ${table}`
    const conditionKeys = Object.keys(conditions)
    if (conditionKeys.length > 0) {
      query += ' WHERE ' + conditionKeys.map(key => `${key} = '${conditions[key]}'`).join(' AND ')
    }
    executeQuery(query, [], (err, results) => {
      if (err) return reject(new Error(`Error reading data: ${err.message}`))
      resolve(results)
    })
  })
}

function dbFactoryUpdate (table, data, conditions) {
  return new Promise((resolve, reject) => {
    const setValues = Object.keys(data).map(key => `${key} = '${data[key]}'`).join(', ')
    const whereClause = Object.keys(conditions).map(key => `${key} = '${conditions[key]}'`).join(' AND ')
    const query = `UPDATE ${table} SET ${setValues} WHERE ${whereClause}`
    executeQuery(query, [], (err, results) => {
      if (err) return reject(new Error(`Error updating data: ${err.message}`))
      resolve({ ...data, changedRows: results?.changedRows || 0 })
    })
  })
}

function dbFactoryDelete (table, conditions) {
  return new Promise((resolve, reject) => {
    const whereClause = Object.keys(conditions).map(key => `${key} = '${conditions[key]}'`).join(' AND ')
    const query = `DELETE FROM ${table} WHERE ${whereClause}`
    executeQuery(query, [], (err, results) => {
      if (err) return reject(new Error(`Error deleting data: ${err.message}`))
      resolve(results)
    })
  })
}

module.exports = {
  dbFactoryCreate,
  dbFactoryRead,
  dbFactoryUpdate,
  dbFactoryDelete
}
