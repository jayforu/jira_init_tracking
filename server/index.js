require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

const express = require('express')
const cors = require('cors')
const jiraClientMiddleware = require('./middleware/jiraClient')

const app = express()
app.use(cors())
app.use(express.json())

// Auth routes — no token required
app.use('/oauth/jira', require('./auth'))

// All /api routes require a valid OAuth token
app.use('/api', jiraClientMiddleware)
app.use('/api/projects', require('./routes/projects'))
app.use('/api/pins', require('./routes/pins'))
app.use('/api/jira', require('./routes/jira'))

app.get('/api/health', (_, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`To connect Jira: http://localhost:${PORT}/oauth/jira/login`)
})
