const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const {isValid, parse, format} = require('date-fns')

const dataPath = path.join(__dirname, 'todoApplication.db')

const app = express()
app.use(express.json())

let db = null

const initializeServerAndDb = async () => {
  try {
    db = await open({
      filename: dataPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () =>
      console.log('Server Running at http://localhost:3000/'),
    )
  } catch (error) {
    console.log(`Error Db: ${error.message}`)
    process.exit(1)
  }
}
initializeServerAndDb()

let validStatuses = ['TO DO', 'IN PROGRESS', 'DONE']
let validPriorities = ['HIGH', 'MEDIUM', 'LOW']
let validCategories = ['WORK', 'HOME', 'LEARNING']

const statusCheckingGet = (request, response, next) => {
  const {status, priority, category} = request.query

  if (status && !validStatuses.includes(status)) {
    return response.status(400).send('Invalid Todo Status')
  }
  if (priority && !validPriorities.includes(priority)) {
    return response.status(400).send('Invalid Todo Priority')
  }
  if (category && !validCategories.includes(category)) {
    return response.status(400).send('Invalid Todo Category')
  }

  next()
}

const statusCheckingPost = (request, response, next) => {
  const {status, priority, category} = request.body

  if (!validStatuses.includes(status)) {
    return response.status(400).send('Invalid Todo Status')
  }
  if (!validPriorities.includes(priority)) {
    return response.status(400).send('Invalid Todo Priority')
  }
  if (!validCategories.includes(category)) {
    return response.status(400).send('Invalid Todo Category')
  }

  next()
}

const statusCheckingPut = (request, response, next) => {
  const {status, priority, category} = request.body

  if (status && !validStatuses.includes(status)) {
    return response.status(400).send('Invalid Todo Status')
  }
  if (priority && !validPriorities.includes(priority)) {
    return response.status(400).send('Invalid Todo Priority')
  }
  if (category && !validCategories.includes(category)) {
    return response.status(400).send('Invalid Todo Category')
  }

  next()
}

const databaseConvertResponsiveObject = dbObject => {
  return {
    id: dbObject.id,
    todo: dbObject.todo,
    priority: dbObject.priority,
    status: dbObject.status,
    category: dbObject.category,
    dueDate: dbObject.due_date,
  }
}

//API 1

//Scenario 1
app.get('/todos/', statusCheckingGet, async (request, response) => {
  const {status, priority, search_q, category} = request.query

  if (status) {
    const getQueryStatus = `
      SELECT * 
      FROM todo
      WHERE status LIKE '%${status}%';`
    const getList = await db.all(getQueryStatus)
    return response.send(
      getList.map(eachValues => databaseConvertResponsiveObject(eachValues)),
    )
  }

  //Scenario 2

  if (priority) {
    const getQueryPriority = `
      SELECT * 
      FROM todo
      WHERE priority LIKE '%${priority}%';`
    const getList = await db.all(getQueryPriority)
    return response.send(
      getList.map(eachValues => databaseConvertResponsiveObject(eachValues)),
    )
  }

  //Scenario 3

  if (status && priority) {
    const getQueryList = `
    SELECT * 
    FROM todo
    WHERE status LIKE '%${status}%' AND priority LIKE '%${priority}%';`
    const getDetails = await db.all(getQueryList)
    return response.send(
      getDetails.map(eachValues => databaseConvertResponsiveObject(eachValues)),
    )
  }

  //Scenario 5

  if (category && status) {
    const getQuerycategory = `
    SELECT * 
    FROM todo
    WHERE category LIKE '%${category}%' AND status LIKE '%${status}%';`
    const getCategoryList = await db.all(getQuerycategory)
    return response.send(
      getCategoryList.map(eachValues =>
        databaseConvertResponsiveObject(eachValues),
      ),
    )
  }

  //Scenario 6

  if (category) {
    const getCategory = `
    SELECT *
    FROM todo
    WHERE category LIKE '%${category}%';`
    const getProduct = await db.all(getCategory)
    return response.send(
      getProduct.map(eachValues => databaseConvertResponsiveObject(eachValues)),
    )
  }

  //Scenario 7

  if (category && priority) {
    const getCategoryAndPriority = `
    SELECT * 
    FROM todo
    WHERE category LIKE '%${category}%' AND priority LIKE '%${priority}%';`
    const getCategoryAndPriorityList = await db.all(getCategoryAndPriority)
    return response.send(
      getCategoryAndPriorityList.map(eachValues =>
        databaseConvertResponsiveObject(eachValues),
      ),
    )
  }

  //Scenario 4
  const getSearchQuery = `
    SELECT *
    FROM todo
    WHERE todo LIKE '%${search_q}%';`
  const getSearchList = await db.all(getSearchQuery)
  response.send(
    getSearchList.map(eachValues =>
      databaseConvertResponsiveObject(eachValues),
    ),
  )
})

//API 2
app.get('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const getSpecificDetails = `
  SELECT *
  FROM todo
  WHERE id = ${todoId};`
  const getDetails = await db.get(getSpecificDetails)
  response.send(databaseConvertResponsiveObject(getDetails))
})

//API 3

app.get('/agenda/', async (request, response) => {
  const {date} = request.query
  const parsedDate = parse(date, 'yyyy-MM-dd', new Date())

  if (!isValid(parsedDate)) {
    return response.status(400).send('Invalid Due Date')
  }

  const dateFormat = format(parsedDate, 'yyyy-MM-dd')
  const getQUeryDetails = `
  SELECT *
  FROM todo
  WHERE due_date = '${dateFormat}';`
  const getDateDetails = await db.all(getQUeryDetails)
  response.send(
    getDateDetails.map(eachvalues =>
      databaseConvertResponsiveObject(eachvalues),
    ),
  )
})

//API 4
app.post('/todos/', statusCheckingPost, async (request, response) => {
  const getDetails = request.body
  const {id, todo, priority, status, category, dueDate} = getDetails
  const parsedDate = parse(dueDate, 'yyyy-MM-dd', new Date())
  if (!isValid(parsedDate)) {
    return response.status(400).send('Invalid Due Date')
  }

  const dateFormat = format(parsedDate, 'yyyy-MM-dd')

  const getQueryList = `
  INSERT INTO todo (id, todo, category, priority, status, due_date) 
  VALUES (${id}, '${todo}', '${category}', '${priority}', '${status}', '${dateFormat}');`
  await db.run(getQueryList)
  response.send('Todo Successfully Added')
})

//API 5
app.put('/todos/:todoId/', statusCheckingPut, async (request, response) => {
  const {todoId} = request.params
  const getDetails = request.body
  const {status, priority, todo, category, dueDate} = getDetails
  //Scenario 1
  if (status) {
    const getStatusPut = `
    UPDATE todo
    SET
    status = '${status}'
    WHERE id = ${todoId};`
    await db.run(getStatusPut)
    response.send('Status Updated')
  }
  //Scenario 2
  if (priority) {
    const getPriorityPut = `
    UPDATE todo
    SET
    priority = '${priority}'
    WHERE id = ${todoId};`
    await db.run(getPriorityPut)
    response.send('Priority Updated')
  }
  //Scenario 3
  if (todo) {
    const getTodoPut = `
    UPDATE todo
    SET
    todo = '${todo}'
    WHERE id = ${todoId};`
    await db.run(getTodoPut)
    response.send('Todo Updated')
  }
  //Scenario 4
  if (category) {
    const getCategoryPut = `
    UPDATE todo
    SET
    category = '${category}'
    WHERE id = ${todoId};`
    await db.run(getCategoryPut)
    response.send('Category Updated')
  }
  //Scenario 5
  if (dueDate) {
    const parsedDate = parse(dueDate, 'yyyy-MM-dd', new Date())

    if (!isValid(parsedDate)) {
      return response.status(400).send('Invalid Due Date')
    }

    const dateFormat = format(parsedDate, 'yyyy-MM-dd')

    const getDuePut = `
    UPDATE todo
    SET
    due_date = '${dateFormat}'
    WHERE id = ${todoId};`
    await db.run(getDuePut)
    response.send('Due Date Updated')
  }
})

//API 6
app.delete('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const getDelete = `
  DELETE FROM todo
  WHERE id = ${todoId};`
  await db.run(getDelete)
  response.send('Todo Deleted')
})

module.exports = app
