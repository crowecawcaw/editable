import React from 'react'
import {render} from 'react-dom'


//import 'preact/devtools'

import {Route, Router, IndexRoute, hashHistory} from 'react-router'

import Layout from './Layout.jsx'
import DataStore from './Datastore.jsx'
import Dashboard from './Dashboard.jsx'
import Edit from './Edit.jsx'
import Pages from './Pages.jsx'
import Posts from './Posts.jsx'
import Images from './Images.jsx'
import ViewImage from './ViewImage.jsx'
import Settings from './Settings.jsx'

import Login from './Login.jsx'
import GitApi from './GitApi.jsx'
import { getSiteData } from './utils.jsx'

require('./main.scss')
require('./index.html')
//require('file-loader?name=[name].[ext]!./quill.css')
//import 'normalize.css/normalize.css';
//import 'font-awesome/css/font-awesome.css';
import 'react-mde/lib/styles/react-mde.scss';
import 'react-mde/lib/styles/react-mde-command-styles.scss';
import 'react-mde/lib/styles/markdown-default-theme.scss';

import MarkdownEditor from './editors/MarkdownEditor.jsx'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      loggedIn: false,
      api: false
    }
    this.login = this.login.bind(this)
  }
  login(username, password) {
    return getSiteData()
    .then(data => new GitApi(
      username,
      password,
      data.settings.git.owner,
      data.settings.git.repo,
      data.settings.git.branch
    ))
    .then(api => this.setState({api: api, loggedIn: true}))
    .catch(e => console.log(e))
  }
  render() {
    if(!this.state.loggedIn)
      return <Login login={this.login} />
    else
      return (  
        <DataStore api={this.state.api}>
          <Router history={hashHistory}>
            <Route path="/" component={Layout}>
              <IndexRoute component={Dashboard} />
              <Route path="pages" component={Pages} />
              <Route path="settings" component={Settings} />
              <Route path="posts" component={Posts} />
              <Route path="images" component={Images} />
              <Route path="images/:path" component={ViewImage} />
              <Route path="edit/:path" component={Edit} />
              <Route path="test" component={MarkdownEditor} />
            </Route>
          </Router>
        </DataStore>
      )
  }
}



render(<App />, document.getElementById('app'));