import React from 'react'
import GitApi from './GitApi.jsx'
import { Loading } from './utils.jsx'

class Login extends React.Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: '',
      loggingIn: false
    }
  }
  render() {
    return (
      <div className="login-background" style={{width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div className="card" style={{width: '25em'}}>
          <div className="card-content">
            <div className="form-group label-floating" style={{display: 'block'}}>
                <label className="control-label">Username</label>
                <input className="form-control" type="text" value={this.state.username} onChange={(e) => this.setState({username: e.target.value})} />
            </div>
            <div className="form-group label-floating" style={{display: 'block'}}>
                <label className="control-label">Password</label>
                <input className="form-control" type="password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} />
            </div>
            <button
              className='btn btn-primary'
              style={{width: '100%'}}
              onClick={() => {
                new Promise((resolve, reject) => this.setState({loggingIn: true}, resolve))
                .then(() => this.props.login(this.state.username, this.state.password))
                .catch((e) => this.setState({loggingIn: false}))
              }}
              disabled={this.state.loggingIn}
              >
              <Loading show={this.state.loggingIn}>Login</Loading>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Login