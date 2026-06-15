
const getPort = require('get-port-cjs')
const express = require('express')
const jwt = require('jsonwebtoken');

let server = null
let port = null
const ENDPOINT = '/api/employees'

const verifyToken = (req, res, next) => {
  let authData = req.headers.authorization;
  if (!authData) {
    return res.status(403).send({
      message: 'No token provided!'
    })
  }
  let token = authData.split(' ')[1];

  jwt.verify(token, 'my_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      })
    }
    req.userId = decoded.id;
    next()
  })
}

async function start() {
  if (server) {
    console.warn('Mock server already started without auth')
    return
  }

  port = await getPort()

  const app = express()
  app.use(express.json())

  app.get(ENDPOINT, verifyToken,(req, res) => {
    const USER_AGENT_REGEX = /^Resen\/(\d+\.){2}\d+$/
    const userAgent = req.headers['user-agent']

    if (!userAgent || !USER_AGENT_REGEX.test(userAgent)) {
      console.error('Invalid User-Agent:', userAgent);
      return res.status(400).json({
        success: false,
        error: 'Hibás User-Agent formátum',
        userAgentSent: userAgent
      });
    }

    res.status(200).json({
      success: true,
      data: [
        {
          name: 'Erős István',
          city: 'Szeged',
          salary: 395.8
        }
      ]
    })
  })
  app.post(ENDPOINT, (req, res) => {
    res.status(201).json({
      success: true,
      data: {
        name: req.body.name,
        city: req.body.city,
        salary: req.body.salary
      }
    })
  })
  app.put(ENDPOINT + '/:id', (req, res) => {
    res.status(200).json({
      success: true,
      data: {
        id: req.params.id,
        name: req.body.name,
        city: req.body.city,
        salary: req.body.salary
      }
    })
  })
  app.patch(ENDPOINT + '/:id', (req, res) => {
    res.status(200).json({
      success: true,
      data: {
        id: req.params.id,
        name: req.body.name
      }
    })
  })
  app.delete(ENDPOINT + '/:id', (req, res) => {
    res.status(200).json({
      success: true,
      data: {
        id: req.params.id
      }
    })
  })

  return new Promise((resolve) => {
    server = app.listen(port, () => {
      console.log(`Mock server started on port ${port}`)
      resolve()
    })
  })
}

function stop(done) {
  if (server) {
    server.close(done)
    server = null
    port = null
  } else {
    done()
  }
}

function getUrl() {
  if (!port) {
    throw new Error('Mock server not started. Call start() first.')
  }
  return `http://localhost:${port}${ENDPOINT}`
}

module.exports = {
  start,
  stop,
  getUrl
}
