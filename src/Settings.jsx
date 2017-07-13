import React from 'react'
import JSONEditor from './editors/JSONEditor.jsx'
import yaml from 'js-yaml'

import { Alert, Loading } from './utils.jsx'

class Settings extends React.Component {
  constructor() {
    super()
    this.state = {
      loading: true,
      saving: false,
      data: null,
      schema: false
    }
    this.save = this.save.bind(this)
  }
  componentWillMount() {
    this.context.api.getFile('_config.yml')
    .then(yaml.safeLoad)
    .then(parsed => this.setState({
      data: parsed,
      schema: parsed.schema || false,
      loading: false
      })
    )
  }
  save() {
    new Promise((resolve, reject) => this.setState({saving: true}, resolve))
    .then(() => this.context.api.updateFile('_config.yml', yaml.safeDump(this.state.data)))
    .then(() => this.setState({saving: false}))
  }
  render() {
    if(this.state.schema === false && !this.state.loading)
      return <Alert title='Warning' type='warning'>This site does not have editable data.</Alert>
      
    return (
      <div>
        <div className="top-bar">
          <h4>Site Settings</h4>
          <button className="btn btn-primary" onClick={this.save} disabled={this.state.saving}><Loading show={this.state.saving}>Save</Loading></button>
        </div>
        <div className="container-fluid">
              {this.state.loading ? <Loading /> :
          <JSONEditor value={this.state.data} schema={this.state.schema} onChange={(data) => this.setState({data: data})} /> }
        </div>
      </div>
    )
  }
}

Settings.contextTypes = {
  api: React.PropTypes.object.isRequired
  
}

export default Settings