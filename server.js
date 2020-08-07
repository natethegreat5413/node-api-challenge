const express = require('express')
const projectsRouter = require('./projects/projectsRouter')
const actionsRouter = require('./actions/actionsRouter')

const server = express()

// Global Middleware
server.use(express.json())
server.use('/api/projects', projectsRouter)
server.use('/api/actions', actionsRouter)

server.get('/', (req, res) => {
    res.send(`<h2>node-API-Sprint</h2>`)
})


module.exports = server