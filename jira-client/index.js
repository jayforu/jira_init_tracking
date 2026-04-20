const axios = require('axios')

class JiraClient {
  constructor({ host, email, token }) {
    this.baseUrl = `https://${host}/rest/api/3`
    this.auth = Buffer.from(`${email}:${token}`).toString('base64')
  }

  _headers() {
    return {
      Authorization: `Basic ${this.auth}`,
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
}

module.exports = { JiraClient }
