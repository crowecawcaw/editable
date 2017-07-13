import React from 'react'
import { hashHistory } from 'react-router'
//import Cropper from 'react-cropper'
import { dataFromURI, resizeImage, Modal } from './utils.jsx'
import 'cropperjs/dist/cropper.css'

class ViewImage extends React.Component {
  constructor() {
    super()
    this.state = {
      img: false,
      width: null,
      height: null,
      editing: false,
      renaming: false,
      deleting: false
    }
    this.rename = this.rename.bind(this)
    //this.crop = this.crop.bind(this)
    this.initializeImg = this.initializeImg.bind(this)
    this.delete = this.delete.bind(this)
  }
  componentWillMount() {
    this.initializeImg(this.props, this.context)
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if(!this.state.img)
      this.initializeImg(nextProps, nextContext)
  }
  initializeImg(props, context) {
    const path = atob(props.params.path)
    const img = context.images.find(img => img.path == path)
    if(!img)
      return
    this.setState({img: img})
      
    var imgNode = new Image()
    imgNode.onload = () => this.setState({width: imgNode.width, height: imgNode.height})
    imgNode.src = img.url
  }
  
  //.then(() => this.cropper.getCroppedCanvas().toDataURL('image/jpeg', .8))
  
  rename() {
    this.context.images.rename(img.path, this.state.renaming)
  }
  delete() {
    this.context.images.delete(img.path)
  }
  render() {
    if(!this.state.img)
      return null
    const img = this.state.img
    return (
      <div>
        <div className="top-bar">
          <div>
            <h4>{img.name}</h4>
            <span style={{paddingLeft: '1em'}}>[{this.state.width ? `${this.state.width}px by ${this.state.height}px` : null}]</span>
          </div>
          <div>
            <button className="btn btn-default" onClick={() => this.setState({renaming: this.state.img.name})}>Rename</button>
            <button className="btn btn-default" onClick={() => this.setState({deleting: true})}>Delete</button>
          </div>
        </div>
        <div className="container-fluid" style={{height: '100%'}}>
          <h2></h2>
          <div style={{textAlign: 'center'}}>
            {this.state.editing ? 
              <Cropper
                ref={ref => this.cropper = ref}
                src={img.url}
                style={{maxWidth: '100%', maxHeight: '70vh'}}
                zoomable={false}
                 />
            :
              <img src={img.url} style={{maxWidth: '100%', maxHeight: '70vh'}} />
            }
          </div>
          <Modal open={this.state.deleting}>
            <div>Are you sure you want to delete <em>{img.name}</em></div>
            <button className="btn btn-default" onClick={(e) => this.setState({deleting: false})}>Cancel</button>
            <button className="btn btn-primary" onClick={this.delete}>Delete</button>
          </Modal>
          <Modal open={this.state.renaming}>
            <div>
              <label>New Image Name:</label>
              <input
                type="text"
                className="form-control"
                value={this.state.renaming}
                onChange={e => this.setState({renaming: e.target.value})} />
            </div>
            <button className="btn btn-default" onClick={(e) => this.setState({renaming: false})}>Cancel</button>
            <button className="btn btn-primary" onClick={this.rename}>Rename</button>
          </Modal>
        </div>
      </div>
    )
  }
}

ViewImage.contextTypes = {
  images: React.PropTypes.array.isRequired
}

export default ViewImage