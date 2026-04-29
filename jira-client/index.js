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

  // ── Agile API (boards + sprints) — uses Basic Auth via site URL ───────────

  async getBoards(projectKey) {
    const email = process.env.JIRA_EMAIL
    const apiToken = process.env.JIRA_API_TOKEN
    if (!email || !apiToken || !this.siteUrl) return []
    try {
      const all = []
      let startAt = 0
      while (true) {
        const res = await axios.get(`${this.siteUrl}/rest/agile/1.0/board`, {
          auth: { username: email, password: apiToken },
          params: { projectKeyOrId: projectKey, maxResults: 50, startAt }
        })
        all.push(...(res.data.values || []))
        if (res.data.isLast || !res.data.values?.length) break
        startAt += 50
      }
      return all.map(b => ({ id: b.id, name: b.name, type: b.type }))
    } catch {
      return []
    }
  }

  async getBoardFilterJQL(boardId) {
    const email = process.env.JIRA_EMAIL
    const apiToken = process.env.JIRA_API_TOKEN
    if (!email || !apiToken || !this.siteUrl) return null
    try {
      const config = await axios.get(`${this.siteUrl}/rest/agile/1.0/board/${boardId}/configuration`, {
        auth: { username: email, password: apiToken }
      })
      const filterId = config.data.filter?.id
      if (!filterId) return null
      const filter = await axios.get(`${this.siteUrl}/rest/api/3/filter/${filterId}`, {
        auth: { username: email, password: apiToken }
      })
      const baseJQL = filter.data.jql
      if (!baseJQL) return null
      const stripOrderBy = q => q.replace(/\s+ORDER\s+BY\s+.*$/i, '').trim()
      const parts = [`(${stripOrderBy(baseJQL)})`]

      // subQuery — e.g. kanban "fixVersion in unreleasedVersions()"
      const subQuery = config.data.subQuery?.query
      if (subQuery) parts.push(`(${stripOrderBy(subQuery)})`)

      // Restrict to the issues actually rendered on the board across all
      // swimlanes (Group: Queries). Returns numeric issue IDs from Jira's
      // internal allData endpoint — much more precise than approximating via
      // JQL because it captures the exact set the board UI displays.
      const visibleIds = await this.getBoardVisibleIssueIds(boardId)
      if (visibleIds && visibleIds.length) {
        parts.push(`id in (${visibleIds.join(',')})`)
      }

      return parts.join(' AND ')
    } catch {
      return null
    }
  }

  // Fetch the issues currently rendered on a board (across all swimlanes,
  // including the default catch-all). Uses Jira's internal "allData" endpoint
  // which is undocumented but stable on Cloud. Returns null on failure so the
  // caller can skip the constraint and fall back to the saved-filter scope.
  async getBoardVisibleIssueIds(boardId) {
    const email = process.env.JIRA_EMAIL
    const apiToken = process.env.JIRA_API_TOKEN
    if (!email || !apiToken || !this.siteUrl) return null
    try {
      const res = await axios.get(`${this.siteUrl}/rest/greenhopper/1.0/xboard/work/allData.json`, {
        params: { rapidViewId: boardId },
        auth: { username: email, password: apiToken }
      })
      const lanes = res.data?.swimlanesData?.customSwimlanesData?.swimlanes
        || res.data?.customSwimlanesData?.swimlanes
        || []
      const ids = new Set()
      for (const lane of lanes) {
        for (const id of (lane.issueIds || [])) ids.add(id)
      }
      // Some boards may not use custom swimlanes — fall back to issuesData if so
      if (!ids.size && Array.isArray(res.data?.issuesData?.issues)) {
        for (const issue of res.data.issuesData.issues) {
          if (issue.id) ids.add(Number(issue.id))
        }
      }
      return ids.size ? [...ids] : null
    } catch {
      return null
    }
  }

  async getBoardQuickFilters(boardId) {
    const email = process.env.JIRA_EMAIL
    const apiToken = process.env.JIRA_API_TOKEN
    if (!email || !apiToken || !this.siteUrl) return []
    try {
      const res = await axios.get(`${this.siteUrl}/rest/agile/1.0/board/${boardId}/quickfilter`, {
        auth: { username: email, password: apiToken }
      })
      const values = res.data?.values || []
      return values
        .map(v => ({ id: v.id, name: v.name, jql: v.jql || v.query, description: v.description || '' }))
        .filter(v => v.jql && v.jql.trim())
    } catch {
      return []
    }
  }

  async getSprints(boardId) {
    const email = process.env.JIRA_EMAIL
    const apiToken = process.env.JIRA_API_TOKEN
    if (!email || !apiToken || !this.siteUrl) return []
    try {
      const res = await axios.get(`${this.siteUrl}/rest/agile/1.0/board/${boardId}/sprint`, {
        auth: { username: email, password: apiToken },
        params: { state: 'active,closed', maxResults: 50 }
      })
      return (res.data.values || []).map(s => ({
        id: s.id, name: s.name, state: s.state,
        start_date: s.startDate, end_date: s.endDate
      }))
    } catch {
      return []
    }
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
            title: pr.name,
            status: pr.status,
            url: pr.url,
            last_update: pr.lastUpdate,
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
