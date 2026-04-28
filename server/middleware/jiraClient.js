const db = require('../db')
const { JiraClient } = require('@local/jira-client')

const { JIRA_CLIENT_ID, JIRA_CLIENT_SECRET } = process.env

async function jiraClientMiddleware(req, res, next) {
  const auth = db.get('auth').value()

  if (!auth?.access_token) {
    return res.status(401).json({ error: 'Not authenticated. Visit http://localhost:3001/auth/login' })
  }

  // Refresh token if expired (with 60s buffer)
  if (Date.now() > auth.expires_at - 60000) {
    try {
      const tokens = await JiraClient.refreshAccessToken(
        JIRA_CLIENT_ID, JIRA_CLIENT_SECRET, auth.refresh_token
      )
      db.get('auth').assign({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || auth.refresh_token,
        expires_at: Date.now() + (tokens.expires_in * 1000)
      }).write()
      auth.access_token = tokens.access_token
    } catch (err) {
      return res.status(401).json({ error: 'Token refresh failed. Please re-authenticate at /auth/login' })
    }
  }

  req.jira = new JiraClient({ accessToken: auth.access_token, cloudId: auth.cloud_id, siteUrl: auth.site_url })
  next()
}

module.exports = jiraClientMiddleware
