const express = require('express')
const router = express.Router()
const db = require('./db')
const { JiraClient } = require('@local/jira-client')

const { JIRA_CLIENT_ID, JIRA_CLIENT_SECRET, JIRA_REDIRECT_URI } = process.env

// GET /auth/login — redirects browser to Atlassian consent screen
router.get('/login', (req, res) => {
  const url = JiraClient.getAuthorizationUrl(JIRA_CLIENT_ID, JIRA_REDIRECT_URI)
  res.redirect(url)
})

// GET /auth/callback — Atlassian redirects here after user consent
router.get('/callback', async (req, res) => {
  const { code, error } = req.query
  if (error || !code) {
    return res.send(`<h2>Auth failed: ${error || 'no code returned'}</h2>`)
  }

  try {
    const tokens = await JiraClient.exchangeCodeForTokens(
      JIRA_CLIENT_ID, JIRA_CLIENT_SECRET, JIRA_REDIRECT_URI, code
    )

    // Discover cloudId for this Jira instance
    const resources = await JiraClient.getAccessibleResources(tokens.access_token)
    if (!resources.length) return res.send('<h2>No Jira sites found for this account.</h2>')

    // Use the first accessible resource (can be extended to let user pick)
    const { id: cloudId, name: siteName, url: siteUrl } = resources[0]

    db.get('auth').assign({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + (tokens.expires_in * 1000),
      cloud_id: cloudId,
      site_name: siteName,
      site_url: siteUrl
    }).write()

    res.send(`
      <h2>Connected to ${siteName}!</h2>
      <p>Cloud ID: ${cloudId}</p>
      <p>You can close this tab and return to the app.</p>
      <script>setTimeout(() => window.close(), 2000)</script>
    `)
  } catch (err) {
    console.error('OAuth callback error:', err.response?.data || err.message)
    res.send(`<h2>Auth error</h2><pre>${JSON.stringify(err.response?.data || err.message, null, 2)}</pre>`)
  }
})

// GET /auth/status — frontend polls this to know if connected
router.get('/status', (req, res) => {
  const auth = db.get('auth').value()
  if (!auth?.access_token) return res.json({ connected: false })
  res.json({
    connected: true,
    site_name: auth.site_name,
    site_url: auth.site_url,
    cloud_id: auth.cloud_id,
    expires_at: auth.expires_at
  })
})

// GET /auth/logout — clears stored tokens
router.get('/logout', (req, res) => {
  db.get('auth').assign({
    access_token: null, refresh_token: null,
    expires_at: null, cloud_id: null,
    site_name: null, site_url: null
  }).write()
  res.json({ disconnected: true })
})

module.exports = router
