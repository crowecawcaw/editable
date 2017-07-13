//import GitHub from 'github-api';

import 'whatwg-fetch'
const API_URL = 'https://api.github.com'
//constructor
//getFile
//getDirectory
//createFile
//updateFile
//moveFile



class api {
  constructor(username, password, repoOwner, repo, branch) {
    const headers = {'Authorization': `Basic ${btoa(`${username}:${password}`)}`}
    return fetch(API_URL + '/user', {headers: headers})
    .then(response => {
      if(response.status == 200) {
        this.headers = headers
        return fetch(`${API_URL}/repos/${repoOwner}/${repo}/contents/`, {headers: this.headers})
      } else {
        throw 'GitHub login credentials are incorrect.'
      }
    })
    .then(response => {
      if(response.status == 200) {
        this.repoPath = `${API_URL}/repos/${repoOwner}/${repo}/`
        this.repoContentsPath = this.repoPath + 'contents/'
        this.repoOwner = repoOwner
        this.repo = repo
        this.branch = branch
        
        return this
      } else {
        throw 'Cannot find repository. Check the repository and repository owner in the admin settings.'
      }
    })
  }
  _get(path) {
    return fetch(`${this.repoContentsPath}${path}?ref=${this.branch}&cacheBust=${(new Date).getTime()}`, {headers: this.headers, cache: 'no-store'})
    .then(this.parseResponse)
  }
  parseResponse(response) {
      if(response.status >= 200 && response.status <=300)
        return response.json()
      else
        throw 'Error connecting with GitHub API.'
  }
  getFile(path, decode = true) {
    return this._get(path)
    .then(json => fetch(json.git_url))
    .then(response => response.json())
    .then(json => decode ? atob(json.content) : json.content)
  }
  getDirectory(path) {
    return this._get(path)
    .then(this._mapAttr)
  }
  _mapAttr(input) {
     const mapping = (file) => {
      if(file.hasOwnProperty('content'))
        return {
          name: file.name,
          path: file.path,
          type: file.type,
          sha: file.sha,
          url: file.download_url,
          content: file.content
        }
      else
        return {
          name: file.name,
          path: file.path,
          type: file.type,
          sha: file.sha,
          url: file.download_url,
        }
    }
     
   if(Array.isArray(input))
      return input.map(mapping)
    else
      return mapping(input)
  }
  createFile(path, content, encode = true, message) {
    return fetch(this.repoContentsPath + path, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify({
        path: path,
        message: message || `Added ${path} from the admin panel.`,
        content: encode === false ? content : btoa(content),
        branch: this.branch
      })
    })
    .then(this.parseResponse)
    .then(json => this._mapAttr(json.content))
  }
  updateFile(path, content, encode = true, message) {
    return this._get(path)
    .then(json => 
      fetch(this.repoContentsPath + path, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify({
          path: path,
          message: message || `Update to ${path} from the admin panel.`,
          content: encode === false ? content : btoa(content),
          branch: this.branch,
          sha: json.sha
        })
      })
    )
  }
  _delete(path, sha, message) {
    return fetch(this.repoContentsPath + path, {
    method: 'DELETE',
    headers: this.headers,
      body: JSON.stringify({
        path: path,
        message: message || `Deleted ${path} from the admin panel.`,
        branch: this.branch,
        sha: sha
      })
    })
  }
  deleteFile(path, message) {
    return this._get(path)
    .then(json => this._delete(path, json.sha, message))
  }
  moveFile(path, newPath, message) {
    const messageOut = message || `Moving ${path} to ${newPath} from the admin panel.`
    
    return fetch(`${this.repoPath}branches/${this.branch}`, {headers: this.headers})
    .then(this.parseResponse)
    .then(json => json.commit.sha)
    .then(treeSha => {
      fetch(`${this.repoPath}git/trees/${treeSha}?recursive=1`, {headers: this.headers})
      .then(this.parseResponse)
      .then(json => json.tree)
      .then(tree => {
        const file = tree.find(item => item.path == path)
        file.path = newPath
        return fetch(`${this.repoPath}git/trees`, {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            tree: tree
          })
        })
      })
      .then(this.parseResponse)
      .then(json => json.sha)
      .then(newSha => {
        return fetch(`${this.repoPath}git/commits`, {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            message: messageOut,
            tree: newSha,
            parents: [treeSha]
          })
        })
      })
      .then(this.parseResponse)
      .then(json => json.sha)
      .then(commitSha => {
        return fetch(`${this.repoPath}git/refs/heads/${this.branch}`, {
          method: 'PATCH',
          headers: this.headers,
          body: JSON.stringify({
            sha: commitSha
          })
        })
      })
    })
  }
}

export default api