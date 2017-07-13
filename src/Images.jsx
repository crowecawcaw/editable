import React from 'react'
import Dropzone from 'react-dropzone'
import { Link } from 'react-router'

import { pathToUrl, resizeImage, uniqueFilename, dataFromURI, Alert } from './utils.jsx'

class Images extends React.Component {
  constructor(props, context) {
    super()
    this.state = {
      uploading: false
    }
    this.onDrop = this.onDrop.bind(this)
  }
  onDrop(files) {
    new Promise((resolve, reject) => {this.setState({uploading: true}, resolve)})
    .then(() => Promise.all(files.map(file => file.type.match(/image.*/) ? this.context.images.add(file) : null)))
    .then(() => new Promise((resolve, reject) => {this.setState({uploading: false}, resolve)}))
  }
  
  render() {
    const images = this.context.images.map(img => {
      const thumbnail = img.thumbnail || img
      return (
        <div key={thumbnail.path} className="col-sm-3" style={{textAlign: 'center'}}>
          <Link to={'images/' + pathToUrl(img.path)}>
            <img
              src={thumbnail.url}
              style={{width: '100%', height: '175px', objectFit: 'contain'}}
              className="img-lib-btn" />
          </Link>
          <span>{img.name}</span>
        </div>
      )
    })
    const Uploading = (
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,.5)',
        zIndex: 100,
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <i className="material-icons spin" style={{color: '#fff', fontSize: '2em', display: 'block'}}>autorenew</i>
        <h3 style={{color: '#fff'}}>Uploading</h3>
      </div>
    )
    return (
      <Dropzone
        onDrop={this.onDrop}
        disableClick={true}
        disablePreview={true}
        ref={el => this.dropzone = el }
        style={{height: '100%', width: '100%'}}
        activeStyle={{backgroundColor: 'rgba(0, 0, 0, .5)'}}>
        {this.state.uploading ? Uploading : null}
        <div className="top-bar">
          <h4 style={{display: 'inline-block'}}>Image Gallery</h4>
          <button className="btn btn-default" onClick={() => this.dropzone.open()}>Upload Image</button>
        </div>
        <div className="container-fluid" style={{paddingTop: '1em'}}>
            <div className="row">
              {images}
            </div>
        </div>
      </Dropzone>
    )
  }
}

Images.contextTypes = {
  images: React.PropTypes.array.isRequired
}

export default Images