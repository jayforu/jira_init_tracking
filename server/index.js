require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
require('events').EventEmitter.defaultMaxListeners = 30

const express = require('express')
const cors = require('cors')
const jiraClientMiddleware = require('./middleware/jiraClient')
const { syncOnStartup } = require('./services/sync')

const app = express()
app.use(cors())
app.use(express.json())

// Auth routes — no token required
app.use('/oauth/jira', require('./auth'))

// Sync routes — no jiraClient middleware needed (sync uses its own client)
app.use('/api/sync', require('./routes/sync'))

// All /api routes require a valid OAuth token
app.use('/api', jiraClientMiddleware)
app.use('/api/projects', require('./routes/projects'))
app.use('/api/pins', require('./routes/pins'))
app.use('/api/jira', require('./routes/jira'))
app.use('/api/executive', require('./routes/executive'))
app.use('/api/pis', require('./routes/pis'))
app.use('/api/portfolio', require('./routes/portfolio'))
app.use('/api/team-activity', require('./routes/teamActivity'))
app.use('/api/agile', require('./routes/agile'))

app.get('/api/health', (_, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`To connect Jira: http://localhost:${PORT}/oauth/jira/login`)
  syncOnStartup()
})
