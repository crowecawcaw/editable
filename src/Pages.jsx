import React from 'react'
import {Link} from 'react-router'
import { Modal, pathToUrl } from './utils.jsx'
import { hashHistory } from 'react-router'
import DatePicker from 'react-datepicker'
import Moment from 'moment'

class Pages extends React.Component {
  constructor() {
    super()
    this.state = {
      newPageModal: false,
      newPageTitle: '',
      newPageDate: Moment(),
      newPagePermalink: false,
      deletePagePath: false
    }
    this.addPage = this.addPage.bind(this)
    this.deletePage = this.deletePage.bind(this)
  }
  addPage() {
    const path = ((this.props.posts ? this.state.newPageDate.format('YYYY-MM-DD') + '-' : '') + this.state.newPageTitle) .toLowerCase().replace(' ', '-') + '.md'
    this.context.pages.add(path, "---\ntitle: " + this.state.newPageTitle + "\n---\n")
    .then(() => hashHistory.push('/edit/' + pathToUrl(path)))
  }
  deletePage() {
    this.context.pages.remove(this.state.deletePagePath)
    .then(() => this.setState({deletePagePath: false}))
  }
  render() {
    var rows = (this.props.posts ? this.context.posts : this.context.pages)
    .concat()
    .sort((a,b) => (this.props.posts ? a.date - b.date : a.title.localeCompare(b.title)))
    .map((p,i) => 
       <tr key={p.path}>
         {this.props.posts ? <td>{p.date}</td> : null}
         <td><Link to={"/edit/" + pathToUrl(p.path)}>{p.title}</Link></td>
         <td><em>{p.url}</em></td>
         <td>
           <a className="btn btn-default btn-small" href={p.url} target="_blank">View</a>
           <Link className="btn btn-default btn-small" to={"/edit/" + pathToUrl(p.path)}>Edit</Link>
           <button className="btn btn-default btn-small" onClick={() => this.setState({deletePagePath: p.path})}>Delete</button>
          </td>
       </tr>           
    )
    return (
      <div>  
        <div className="top-bar">
          <h4 style={{display: 'inline-block'}}>{this.props.posts ? 'Posts' : 'Pages'}</h4>
          <button className="btn btn-default" style={{float: 'right'}} onClick={() => this.setState({newPageModal: true})}>Add</button>
        </div>
        <div className="container-fluid">  
          <div className="card">
            <div className="card-content">
              <table className="table table-condensed">
                <thead>
                  <tr className="text-primary">
                    {this.props.posts ? <th>Date</th> : null}
                    <th>Title</th>
                    <th>URL</th>
                    <th style={{maxWidth: '200px'}}>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {rows}
                </tbody>
              </table>
            </div>
          </div>
          <Modal open={this.state.newPageModal}>
            {this.props.posts ?
              <DatePicker dateFormat="YYYY-MM-DD" selected={this.state.newPageDate} onChange={m => this.setState({newPageDate: m})} className="form-control" />
            :
              null
            }
            <input className="form-control" type="text" value={this.state.newpageTitle} onChange={(e) => this.setState({newPageTitle: e.target.value})} />
            <button className="btn btn-primary" onClick={this.addPage}>Add</button>
          </Modal>
          <Modal open={this.state.deletePagePath}>
            Are you sure you want to delete this page?
            <button className="btn btn-primary" onClick={this.deletePage}>Delete</button>
            <button className="btn btn-primary" onClick={() => this.setState({deletePagePath: false})}>Cancel</button>
          </Modal>      
        </div>
      </div>
    )
  }
}

Pages.contextTypes = {
  pages: React.PropTypes.array.isRequired,
  posts:  React.PropTypes.array.isRequired
}

export default Pages