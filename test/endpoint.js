process.env.NODE_ENV = 'test'

const http = require('http')
const test = require('tape')
const servertest = require('servertest')
const app = require('../lib/app')
const MOCK_DATA = require('./mockData')
const { CONVERSION_API_PROJECT_NAMES } = require('../lib/constants')

const server = http.createServer(app)

test('GET /health should return 200', function (t) {
  servertest(server, '/health', { encoding: 'json' }, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 200, 'should return 200')
    t.end()
  })
})

test('GET /api/ok should return 200', function (t) {
  servertest(server, '/api/ok', { encoding: 'json' }, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 200, 'should return 200')
    t.ok(res.body.ok, 'should return a body')
    t.end()
  })
})

test('GET /api/project/budget/:id should return 200', function (t) {
  const projectId = 1
  const expectedResult = MOCK_DATA.find(p => p.projectId === projectId)

  servertest(server, `/api/project/budget/${projectId}`, { encoding: 'json' }, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 200, 'should return 200')
    t.deepEqual(res.body.data, expectedResult, 'expected result should match actual result')
    t.end()
  })
})

test('GET /api/project/budget/:id should return 404', function (t) {
  const projectId = 0
  servertest(server, `/api/project/budget/${projectId}`, { encoding: 'json' }, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.body.success, false, 'should return success = false')
    t.equal(res.statusCode, 404, 'should return 404')
    t.end()
  })
})

test('PUT /api/project/budget/:id should return 200', function (t) {
  const projectId = 1
  const updateData = { projectName: 'Updated Project' }

  const opts = {
    method: 'PUT',
    encoding: 'json',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const req = servertest(server, `/api/project/budget/${projectId}`, opts, function (err, res) {
    const { changedRows, ...actualUpdate } = res.body.data
    t.error(err, 'No error')
    t.equal(res.statusCode, 200, 'should return 200')
    t.equal(res.body.success, true, 'should return success = true')
    t.deepEqual(actualUpdate, updateData, 'expected result should match actual result')
    t.end()
  })

  req.write(JSON.stringify(updateData))
  req.end()
})

test('PUT /api/project/budget/:id should return 404', function (t) {
  const projectId = 0
  const updateData = { projectName: 'NOT UPDATED' }

  const opts = {
    method: 'PUT',
    encoding: 'json',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const req = servertest(server, `/api/project/budget/${projectId}`, opts, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.body.success, false, 'should return success = false')
    t.equal(res.statusCode, 404, 'should return 404')
    t.end()
  })

  req.write(JSON.stringify(updateData))
  req.end()
})

test('POST /api/project/budget should return 201', function (t) {
  const dataToAdd = {
    projectId: 79,
    projectName: 'Pizza fugazeta SAP',
    year: 2020,
    currency: 'GBP',
    initialBudgetLocal: 753977.31,
    budgetUsd: 463006.73,
    initialScheduleEstimateMonths: 22,
    adjustedScheduleEstimateMonths: 23,
    contingencyRate: 8.44,
    escalationRate: 2.47,
    finalBudgetUsd: 514485.99
  }

  const opts = {
    method: 'POST',
    encoding: 'json',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const req = servertest(server, '/api/project/budget', opts, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 201, 'should return 201')
    t.equal(res.body.success, true, 'should return success = true')
    t.deepEqual(res.body.data, dataToAdd, 'expected result should match actual result')
    t.end()
  })

  req.write(JSON.stringify(dataToAdd))
  req.end()
})

test('POST /api/project/budget should return 500', function (t) {
  const dataToAdd = MOCK_DATA[0]

  const opts = {
    method: 'POST',
    encoding: 'json',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const req = servertest(server, '/api/project/budget', opts, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 500, 'should return 500')
    t.equal(res.body.success, false, 'should return success = false')
    t.end()
  })

  req.write(JSON.stringify(dataToAdd))
  req.end()
})

test('Delete /api/project/budget/:id should return 200', function (t) {
  const projectId = 1
  const opts = {
    method: 'DELETE',
    encoding: 'json'
  }
  servertest(server, `/api/project/budget/${projectId}`, opts, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 200, 'should return 200')
    t.equal(res.body.success, true, 'should return success = true')
    t.end()
  })
})

test('Delete /api/project/budget/:id should return 404', function (t) {
  const projectId = 0
  const opts = {
    method: 'DELETE',
    encoding: 'json'
  }
  servertest(server, `/api/project/budget/${projectId}`, opts, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 404, 'should return 404')
    t.equal(res.body.success, false, 'should return success = false')
    t.end()
  })
})

test('POST /api/project/budget/currency should return 200', function (t) {
  const localData = MOCK_DATA[1]
  const currencyToConvert = 'TTD'

  const payload = {
    year: localData.year,
    projectName: localData.projectName,
    currency: currencyToConvert
  }

  const expectedResult = MOCK_DATA.filter(d => d.year === localData.year && d.projectName === localData.projectName)

  const opts = {
    method: 'POST',
    encoding: 'json',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const req = servertest(server, '/api/project/budget/currency', opts, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 200, 'should return 200')
    t.equal(res.body.success, true, 'should return success = true')
    t.equal(res.body.data.length, expectedResult.length)
    t.end()
  })

  req.write(JSON.stringify(payload))
  req.end()
})

test('POST /api/project/budget/currency should return 400', function (t) {
  const localData = MOCK_DATA[1]
  const currencyToConvert = 'TTD'

  const payload = {
    year: localData.year,
    currency: currencyToConvert
  }

  const opts = {
    method: 'POST',
    encoding: 'json',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const req = servertest(server, '/api/project/budget/currency', opts, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 400, 'should return 400')
    t.equal(res.body.success, false, 'should return success = false')
    t.end()
  })

  req.write(JSON.stringify(payload))
  req.end()
})

test('GET /api/api-conversion should return 200', function (t) {
  const expectedResLength = MOCK_DATA.filter(pb => CONVERSION_API_PROJECT_NAMES.some(
    md => md.toLowerCase() === pb.projectName?.toLowerCase()
  )
  ).length

  servertest(server, '/api/api-conversion', { encoding: 'json' }, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 200, 'should return 200')
    t.equal(res.body.data.length, expectedResLength)
    t.end()
  })
})

test('GET /nonexistent should return 404', function (t) {
  servertest(server, '/nonexistent', { encoding: 'json' }, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 404, 'should return 404')
    t.end()
  })
})
