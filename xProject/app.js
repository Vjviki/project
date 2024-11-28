const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const databasePath = path.join(__dirname, 'twitterClone.db')

const app = express()

app.use(express.json())

let db = null

const initializeingDbAndServer = async () => {
  try {
    db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (erroe) {
    console.log(`DB Error: ${erroe.message}`)
    process.exit(1)
  }
}

initializeingDbAndServer()

//API 1 Create New User
app.post('/register/', async (request, response) => {
  const getQueryDetails = request.body
  const {username, password, name, gender} = getQueryDetails

  const getDetails = `
    SELECT *
    FROM user
    WHERE username = '${username}';`
  const getUserDetails = await db.get(getDetails)
  //Scenario 1
  if (getUserDetails !== undefined) {
    response.status(400).send('User already exists')
  } else {
    //Scenario 2
    if (password.length < 6) {
      response.status(400).send('Password is too short')
    }
    //Scenario 3
    else {
      const encrypted = await bcrypt.hash(password, 10)
      const getPostDetails = `
      INSERT INTO user (name, username, password, gender)
      VALUES
      ('${name}', '${username}', '${encrypted}','${gender}');`
      await db.run(getPostDetails)
      response.status(200).send('User created successfully')
    }
  }
})

//API 2 User Login
app.post('/login/', async (request, response) => {
  const getDetails = request.body
  const {username, password} = getDetails
  const getQueryDetails = `
  SELECT *
  FROM user
  WHERE username = '${username}';`
  const getUserDetails = await db.get(getQueryDetails)

  //Scenario 1
  if (getUserDetails === undefined) {
    response.status(400).send('Invalid user')
  } else {
    const isPasswordMatched = await bcrypt.compare(
      password,
      getUserDetails.password,
    )
    //Scenario 2
    if (!isPasswordMatched) {
      response.status(400).send('Invalid password')
    }
    //Scenario 3
    else {
      const payload = {
        user_id: getUserDetails.user_id,
        username: getUserDetails.username,
      }
      const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN')
      response.send({jwtToken})
    }
  }
})

const jwtTokenVerificationStep = (request, response, next) => {
  const authHeader = request.headers['authorization']
  if (!authHeader) {
    return response.status(401).send('Invalid JWT Token') // No token provided
  }

  const jwtToken = authHeader.split(' ')[1]
  if (!jwtToken) {
    return response.status(401).send('Invalid JWT Token') // Token is missing
  }

  jwt.verify(jwtToken, 'MY_SECRET_TOKEN', (error, decoded) => {
    if (error) {
      return response.status(401).send('Invalid JWT Token') // Invalid token
    }
    request.user = decoded
    next() // Continue with the request
  })
}

//API 3
app.get(
  '/user/tweets/feed/',
  jwtTokenVerificationStep,
  async (request, response) => {
    const userId = request.user.user_id
    const getUserTweet = `
  SELECT user.username, tweet.tweet, tweet.date_time AS dateTime
  FROM 
    follower
  INNER JOIN 
    tweet ON follower.following_user_id = tweet.user_id
  INNER JOIN 
    user ON user.user_id = tweet.user_id
    WHERE follower.follower_user_id = ${userId} 
  ORDER BY tweet.date_time DESC
  LIMIT 4 ;`
    const getUserTweetDetails = await db.all(getUserTweet)
    response.send(getUserTweetDetails)
  },
)

//API 4
app.get(
  '/user/following/',
  jwtTokenVerificationStep,
  async (request, response) => {
    const userId = request.user.user_id
    const getFollowingDetails = `
  SELECT user.name AS name
  FROM user 
  INNER JOIN follower 
  ON user.user_id = follower.following_user_id
  WHERE follower.follower_user_id = ${userId};`
    const getFollowing = await db.all(getFollowingDetails)
    const formattedFollowing = getFollowing.map(eachValues => eachValues)
    response.send(formattedFollowing)
  },
)

//API 5
app.get(
  '/user/followers/',
  jwtTokenVerificationStep,
  async (request, response) => {
    const userId = request.user.user_id
    const getFollowerDetails = `
  SELECT user.name AS name
  FROM user INNER JOIN follower ON user.user_id = follower.follower_user_id
  WHERE follower.following_user_id = ${userId};`
    const getFollower = await db.all(getFollowerDetails)
    const formattedFollowing = getFollower.map(eachValues => eachValues)
    response.send(formattedFollowing)
  },
)

const checkFollowing = async (request, response, next) => {
  const {tweetId} = request.params

  // Step 1: Check if the user follows the author of the tweet
  const getFollowingQuery = `
      SELECT 1
      FROM tweet 
      INNER JOIN follower ON tweet.user_id = follower.following_user_id
      WHERE tweet.tweet_id = ${tweetId};
    `
  const following = await db.get(getFollowingQuery)

  if (!following) {
    response.status(401).send('Invalid Request')
    return
  }

  next()
}

//API 6
app.get(
  '/tweets/:tweetId/',
  jwtTokenVerificationStep,
  checkFollowing,
  async (request, response) => {
    const {tweetId} = request.params
    // Step 1: Fetch tweet details
    const getTweetQuery = `
      SELECT 
        tweet.tweet AS tweet,
        (SELECT COUNT(*) FROM like WHERE like.tweet_id = tweet.tweet_id) AS likes,
        (SELECT COUNT(*) FROM reply WHERE reply.tweet_id = tweet.tweet_id) AS replies,
        tweet.date_time AS dateTime
      FROM tweet
      WHERE tweet.tweet_id = ${tweetId};
    `
    const tweetDetails = await db.get(getTweetQuery)
    response.send(tweetDetails)
  },
)

//API 7
app.get(
  '/tweets/:tweetId/likes/',
  jwtTokenVerificationStep,
  checkFollowing,
  async (request, response) => {
    const {tweetId} = request.params
    // Step 1: Fetch like details
    const getLikeUserName = `
  SELECT user.username AS likes
  FROM user INNER JOIN like ON user.user_id = like.user_id
  WHERE like.tweet_id = ${tweetId};`
    const getLikes = await db.all(getLikeUserName)
    const likes = getLikes.map(like => like.likes)
    response.send({likes})
  },
)

//API 8
app.get(
  '/tweets/:tweetId/replies/',
  jwtTokenVerificationStep,
  checkFollowing,
  async (request, response) => {
    const {tweetId} = request.params
    const getQueryReplies = `
  SELECT user.name, reply.reply 
  FROM tweet
  INNER JOIN reply ON tweet.tweet_id = reply.tweet_id
  INNER JOIN user ON user.user_id = reply.user_id
  WHERE tweet.tweet_id = ${tweetId};`
    const getReplies = await db.all(getQueryReplies)
    const tweet = getReplies.length > 0 ? getReplies[0].tweet : null
    const formattedReplies = getReplies.map(r => ({
      name: r.name,
      reply: r.reply,
    }))
    response.send({tweet, replies: formattedReplies})
  },
)

//API 9
app.get(
  '/user/tweets/',
  jwtTokenVerificationStep,
  async (request, response) => {
    const userId = request.user.user_id
    const getTweetQuery = `
      SELECT 
        tweet.tweet,
        (SELECT COUNT(*) FROM like WHERE like.tweet_id = tweet.tweet_id) AS likes,
        (SELECT COUNT(*) FROM reply WHERE reply.tweet_id = tweet.tweet_id) AS replies,
        tweet.date_time AS dateTime
      FROM tweet
      WHERE tweet.user_id = ${userId};`
    const getall = await db.all(getTweetQuery)
    response.send(getall)
  },
)
//API 10
app.post(
  '/user/tweets/',
  jwtTokenVerificationStep,
  async (request, response) => {
    const getTweetData = request.body
    const {tweet} = getTweetData

    const updateQuery = `
  INSERT INTO tweet (tweet)
  VALUES ('${tweet}');`
    await db.run(updateQuery)
    response.send('Created a Tweet')
  },
)

//API 11
app.delete(
  '/tweets/:tweetId/',
  jwtTokenVerificationStep,
  async (request, response) => {
    const {tweetId} = request.params
    const userId = request.user.user_id // Extract the authenticated user's ID from the JWT token

    // Check if the tweet exists and belongs to the user
    const checkTweetQuery = `
      SELECT user_id 
      FROM tweet 
      WHERE tweet_id = ${tweetId};`

    const tweet = await db.get(checkTweetQuery)

    // If the tweet doesn't exist
    console.log(tweet)
    if (!tweet) {
      return response.status(404).send('Invalid Request')
    }

    // If the tweet doesn't belong to the authenticated user
    console.log(userId)
    if (tweet.user_id !== userId) {
      return response.status(401).send('Invalid Request')
    }
    const deleteTweet = `
  DELETE FROM tweet
  WHERE tweet_id = ${tweetId};`
    await db.run(deleteTweet)
    response.send('Tweet Removed')
  },
)

module.exports = app
