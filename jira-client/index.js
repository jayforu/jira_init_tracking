const axios = require('axios')

const ATLASSIAN_API = 'https://api.atlassian.com'
const AUTH_URL = 'https://auth.atlassian.com'

class JiraClient {
  constructor({ accessToken, cloudId }) {
    this.baseUrl = `${ATLASSIAN_API}/ex/jira/${cloudId}/rest/api/3`
    this.accessToken = accessToken
  }

  _headers() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }

  async searchJQL(jql, fields = []) {
    const params = {
      jql,
      maxResults: 200,
      ...(fields.length ? { fields: fields.join(',') } : {})
    }
    const res = await axios.get(`${this.baseUrl}/search`, {
      headers: this._headers(),
      params
    })
    return res.data.issues
  }

  async getIssue(issueKey, fields = []) {
    const params = fields.length ? { fields: fields.join(',') } : {}
    const res = await axios.get(`${this.baseUrl}/issue/${issueKey}`, {
      headers: this._headers(),
      params
    })
    return res.data
  }

  async getIssueLinks(issueKey) {
    const issue = await this.getIssue(issueKey, ['issuelinks'])
    return issue.fields.issuelinks || []
  }

  async getProject(projectKey) {
    const res = await axios.get(`${this.baseUrl}/project/${projectKey}`, {
      headers: this._headers()
    })
    return res.data
  }

  async getIssueTypes(projectKey) {
    const res = await axios.get(`${this.baseUrl}/project/${projectKey}`, {
      headers: this._headers()
    })
    return res.data.issueTypes || []
  }

  // --- Static OAuth helpers (no cloudId needed) ---

  static getAuthorizationUrl(clientId, redirectUri) {
    const scopes = [
      'read:jira-work',
      'read:jira-user',
      'offline_access'
    ].join(' ')
    const params = new URLSearchParams({
      audience: 'api.atlassian.com',
      client_id: clientId,
      scope: scopes,
      redirect_uri: redirectUri,
      state: 'initiative-tracker',
      response_type: 'code',
      prompt: 'consent'
    })
    return `${AUTH_URL}/authorize?${params.toString()}`
  }

  static async exchangeCodeForTokens(clientId, clientSecret, redirectUri, code) {
    const res = await axios.post(`${AUTH_URL}/oauth/token`, {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code
    })
    return res.data
  }

  static async refreshAccessToken(clientId, clientSecret, refreshToken) {
    const res = await axios.post(`${AUTH_URL}/oauth/token`, {
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken
    })
    return res.data
  }

  static async getAccessibleResources(accessToken) {
    const res = await axios.get(`${ATLASSIAN_API}/oauth/token/accessible-resources`, {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' }
    })
    return res.data
  }
}

module.exports = { JiraClient }
