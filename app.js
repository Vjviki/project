const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const databasePath = path.join(__dirname, 'covid19IndiaPortal.db')
const app = express()

app.use(express.json())

let db = null

const initalizeServerAndDatabase = async () => {
  try {
    db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (error) {
    console.log(`Error DB: ${error.message}`)
    process.exit(1)
  }
}
initalizeServerAndDatabase()

//Login API 1
app.post('/login/', async (request, response) => {
  const getUser = request.body
  const {username, password} = getUser
  const getQueryList = `
    SELECT * 
    FROM user
    WHERE username = '${username}';`
  const dbUser = await db.get(getQueryList)
  if (dbUser === undefined) {
    response.status(400)
    response.send('Invalid user')
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password)
    if (isPasswordMatched === true) {
      const payload = {
        username: username,
      }
      const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN')
      response.send({jwtToken})
    } else {
      response.status(400)
      response.send('Invalid password')
    }
  }
})

//Authentication with Token
const authenticateToken = (request, response, next) => {
  let jwtToken
  const authHeader = request.headers['authorization']
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1]
  }

  if (jwtToken === undefined) {
    response.status(401).send('Invalid JWT Token')
    return
  }

  try {
    const isTokenVerify = jwt.verify(jwtToken, 'MY_SECRET_TOKEN')
    next()
  } catch (error) {
    response.status(401)
    response.send('Invalid JWT Token')
  }
}

//Returns list states API 2
app.get('/states/', authenticateToken, async (request, response) => {
  const getQueryList = `
  SELECT state_id AS stateId, state_name AS stateName, population 
  FROM state;`
  const listDetails = await db.all(getQueryList)
  response.send(listDetails)
})

//Get state API 3
app.get('/states/:stateId/', authenticateToken, async (request, response) => {
  const {stateId} = request.params
  const getQueryList = `
  SELECT state_id AS stateId, state_name AS stateName, population
  FROM state
  WHERE state_id = ${stateId};`
  const getState = await db.get(getQueryList)
  response.send(getState)
})

//Post district API 4
app.post('/districts/', authenticateToken, async (request, response) => {
  const getBodyDetails = request.body
  const {districtName, stateId, cases, cured, active, deaths} = getBodyDetails
  const getQueryUpdate = `
  INSERT INTO district (district_name, state_id, cases, cured, active, deaths)
  VALUES(
  '${districtName}',
  ${stateId},
  ${cases},
  ${cured},
  ${active},
  ${deaths});`
  await db.run(getQueryUpdate)
  response.send('District Successfully Added')
})

//get district API 5
app.get(
  '/districts/:districtId/',
  authenticateToken,
  async (request, response) => {
    const {districtId} = request.params
    const getQueryDetail = `
  SELECT district_id AS districtId, district_name AS districtName, state_id AS stateId, cases, cured, active, deaths 
  FROM district
  WHERE district_id = ${districtId};`
    const getDetails = await db.get(getQueryDetail)
    response.send(getDetails)
  },
)

//Delete Details API 6
app.delete(
  '/districts/:districtId/',
  authenticateToken,
  async (request, response) => {
    const {districtId} = request.params
    const deleteDetails = `
  DELETE FROM district
  WHERE district_id = ${districtId};`
    await db.run(deleteDetails)
    response.send('District Removed')
  },
)

//Put Upated API 7
app.put(
  '/districts/:districtId/',
  authenticateToken,
  async (request, response) => {
    const {districtId} = request.params
    const {districtName, stateId, cases, cured, active, deaths} = request.body
    const getQueryUpdate = `
  UPDATE district
  SET
  district_name = '${districtName}',
  state_id = ${stateId},
  cases = ${cases},
  cured = ${cured},
  active = ${active},
  deaths = ${deaths}
  WHERE district_id = ${districtId};`
    await db.run(getQueryUpdate)
    response.send('District Details Updated')
  },
)

//get Totale Number of Details API 8
app.get(
  '/states/:stateId/stats/',
  authenticateToken,
  async (request, response) => {
    const {stateId} = request.params
    const getTotale = `
  SELECT SUM(cases) AS totalCases, SUM(cured) AS totalCured, SUM(active) AS totalActive, SUM(deaths) AS totalDeaths
  FROM state INNER JOIN district ON state.state_id = district.state_id
  WHERE state.state_id = ${stateId};`
    const details = await db.get(getTotale)
    response.send(details)
  },
)

module.exports = app
