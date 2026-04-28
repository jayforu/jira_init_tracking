const axios = require('axios')

const ATLASSIAN_API = 'https://api.atlassian.com'
const AUTH_URL = 'https://auth.atlassian.com'

class JiraClient {
  constructor({ accessToken, cloudId, siteUrl }) {
    this.cloudId = cloudId
    this.siteUrl = siteUrl || null
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
      maxResults: 100,
      ...(fields.length ? { fields: fields.join(',') } : {})
    }
    const res = await axios.get(`${this.baseUrl}/search/jql`, {
      headers: this._headers(),
      params
    })
    return res.data.issues
  }

  async searchJQLAll(jql, fields = []) {
    const allIssues = []
    let nextPageToken = null
    while (true) {
      const params = {
        jql,
        maxResults: 100,
        ...(fields.length ? { fields: fields.join(',') } : {}),
        ...(nextPageToken ? { nextPageToken } : {})
      }
      const res = await axios.get(`${this.baseUrl}/search/jql`, { headers: this._headers(), params })
      const issues = res.data.issues || []
      allIssues.push(...issues)
      nextPageToken = res.data.nextPageToken
      if (!nextPageToken || res.data.isLast) break
    }
    return allIssues
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

  async getDevSummary(issueId) {
    const email    = process.env.JIRA_EMAIL
    const apiToken = process.env.JIRA_API_TOKEN
    if (!email || !apiToken || !this.siteUrl) return { hasPRs: false, hasCommits: false }
    try {
      const res = await axios.get(`${this.siteUrl}/rest/dev-status/1.0/issue/summary`, {
        auth: { username: email, password: apiToken },
        params: { issueId }
      })
      const s = res.data?.summary || {}
      return {
        hasPRs:    (s.pullrequest?.overall?.count || 0) > 0,
        hasCommits: (s.repository?.overall?.count || 0) > 0
      }
    } catch {
      return { hasPRs: false, hasCommits: false }
    }
  }

  async getCommitsForIssue(issueId) {
    const email    = process.env.JIRA_EMAIL
    const apiToken = process.env.JIRA_API_TOKEN
    const platform = process.env.JIRA_GIT_PLATFORM || 'GitHub'
    if (!email || !apiToken) return []
    try {
      const url = `${this.siteUrl}/rest/dev-status/1.0/issue/detail`
      const res = await axios.get(url, {
        auth: { username: email, password: apiToken },
        params: { issueId, applicationType: platform, dataType: 'repository' }
      })
      const commits = []
      for (const detail of (res.data?.detail || [])) {
        for (const repo of (detail.repositories || [])) {
          for (const c of (repo.commits || [])) {
            commits.push({
              id: c.displayId,
              message: c.message,
              url: c.url,
              author: c.author?.name || null,
              timestamp: c.authorTimestamp,
              file_count: c.fileCount || 0,
              merge: c.merge || false,
              repo: repo.name
            })
          }
        }
      }
      return commits
    } catch {
      return []
    }
  }

  async getPRsForIssue(issueId) {
    const email     = process.env.JIRA_EMAIL
    const apiToken  = process.env.JIRA_API_TOKEN
    const platform  = process.env.JIRA_GIT_PLATFORM || 'github'

    if (!email || !apiToken) return []

    try {
      const siteUrl = this.siteUrl
      if (!siteUrl) return []

      const url = `${siteUrl}/rest/dev-status/1.0/issue/detail`
      const res = await axios.get(url, {
        auth: { username: email, password: apiToken },
        params: { issueId, applicationType: platform, dataType: 'pullrequest' }
      })
      const prs = []
      for (const detail of (res.data?.detail || [])) {
        for (const pr of (detail.pullRequests || [])) {
          prs.push({
            title: pr.title,
            status: pr.status,
            url: pr.url,
            created_at: pr.created,
            author: pr.author?.name || null
          })
        }
      }
      return prs
    } catch (e) {
      console.warn(`[dev-status] ${issueId}: ${e.response?.status} ${JSON.stringify(e.response?.data)}`)
      return []
    }
  }

  // --- Static OAuth helpers (no cloudId needed) ---

  static getAuthorizationUrl(clientId, redirectUri) {
    const scopes = [
      'read:jira-work',
      'read:jira-user',
      'read:jira-software',
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
