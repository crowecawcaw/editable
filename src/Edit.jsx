import React from 'react'

import matter from './matter.js'

import MarkdownEditor from './editors/MarkdownEditor.jsx'
import HTMLEditor from './editors/HTMLEditor.jsx'
import JSONEditor from './editors/JSONEditor.jsx'
import { Alert } from './utils.jsx'

export default function Edit(props) {
  const path = atob(props.params.path)
  const lastIndex = path.lastIndexOf('.')
  const extension = lastIndex != -1 ? path.substr(lastIndex + 1).toLowerCase() : false
  
  if(extension == 'md' || extension == 'html' || extension == 'htm')
    return <EditPage path={path} />
  else if(extension == 'yaml' || extension == 'yml' || extension == 'json')
    return <EditData path={path} />
  else
    return <Alert>{path} is not a supported file type.</Alert>
}

class EditPage extends React.Component {
  constructor() {
    super()
    this.state = {
      frontMatter: null,
      content: null,
      loading: true,
      saving: false,
      window: 'content'
    }
    this.save = this.save.bind(this)
    this.editorRef = null
  }
  componentWillMount() {    
    this.context.api.getFile(this.props.path)
    .then(content => matter(content))
    .then(parsed => {
      let frontMatter = parsed.data
      if(this.context.settings.defaultSchema)
        frontMatter.schema = Object.assign({}, this.context.settings.defaultSchema, frontMatter.schema || {})
      this.setState({
        frontMatter: frontMatter,
        content: parsed.content,
        loading: false
      })
    })
  }
  save() {
    new Promise((resolve, reject) => this.setState({saving: true}, resolve))
    .then(() => {
      if(this.editorRef && this.editorRef.save)
        return this.editorRef.save()
      else
        return this.state.content
    })
    .then(updatedContent => matter.stringify(updatedContent, this.state.frontMatter))
    .then(raw => this.context.api.updateFile(this.props.path, raw))
    .then(() => this.setState({saving: false}))
  }
  render() {
    if(this.state.loading)
      return <h1>Loading...</h1>
      
    let window
    if(this.state.window == 'content') {
      const props = {
        path: this.props.path,
        permalink: this.state.frontMatter.permalink || this.props.path,
        title: this.state.frontMatter.title || null,
        content: this.state.content,
        onChange: newContent => this.setState({content: newContent}),
        ref: ref => this.editorRef = ref
      }
      if(getExtension(this.props.path) == 'md')
        window = <MarkdownEditor {...props} />
      else
        window = <HTMLEditor {...props} />
    } else {
      window = (
        <div className="container-fluid full-width">
          <JSONEditor
            title="Page Settings"
            value={this.state.frontMatter}
            onChange={frontMatter => this.setState({frontMatter: frontMatter})} />
        </div>
      )
    }
    
    return (
      <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
        <div className="top-bar">
          <h3 style={{margin: 0, padding: '5px', display: 'inline-block'}}>
            {this.state.title} [<em>{this.props.path}</em>]
          </h3>
          <span style={{float: 'right'}}>
            <button
              className="btn btn-default"
              onClick={() => this.setState({window: 'content'})}
              style={{border: this.state.window == 'content' ? '2px solid #9c27b0' : 0}}>
              Content
            </button>
            <button
              className="btn btn-default"
              onClick={() => this.setState({window: 'settings'})}
              style={{border: this.state.window == 'settings' ? '2px solid #9c27b0' : 0}}>
              Settings
            </button>
            <button
              className="btn btn-success"
              onClick={this.save}
              disabled={this.state.saving}>
              Save
            </button>
          </span>
        </div>
        <div style={{flex: '1 1 auto', display: 'flex'}}>
          {window}
        </div>
      </div>
    )
  }

}

EditPage.contextTypes = {
  api: React.PropTypes.object.isRequired,
  settings: React.PropTypes.object.isRequired
}

function getExtension(path) {
  const lastIndex = path.lastIndexOf('.')
  return lastIndex != -1 ? path.substr(lastIndex + 1).toLowerCase() : false
}