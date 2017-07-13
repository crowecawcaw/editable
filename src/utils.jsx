import React from 'react'

export function pathToUrl(path) {
  return btoa(path).replace(/\=/g, '')
}

export function resizeImage(uri, params, format = 'image/jpeg') {
  let img = new Image
  img.src = uri
  
  let width = img.width
  let height = img.height
  
  if(params.height)
    height = params.height
  if(params.width)
    width = params.width
    
  if(params.maxWidth && (width > params.maxWidth)) {
      height *= params.maxWidth / width
      width = params.maxWidth
  }
  if(params.maxHeight && (height > params.maxHeight)) {
      width *= params.maxHeight / height
      height = params.maxHeight
  }
  
  let canvas = document.createElement('canvas')
  canvas.width = width;
  canvas.height = height;

  let ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)
  return canvas.toDataURL(format, .5)
}

export function getSiteData() {
  return fetch('data.json?cacheBuster=' + (new Date()).getTime())
  .then(response => response.json())
  .then((json) => {
    var out = Object.assign({}, json)
    if(out.settings && out.settings.imageDirectory && out.settings.imageDirectory[0] == '/')
      out.settings.imageDirectory = out.settings.imageDirectory.substr(1)
    out['map'].pages = out['map'].pages.filter(p => p.title) //remove the last, empty page object
    out['map'].posts = out['map'].posts.filter(p => p.title)
    return out
  })
}

export class Loading extends React.Component {
  constructor() {
    super()
    this.state = {
      show: false
    }
  }
  componentWillMount() {
    this.timer = setTimeout(() => this.setState({show: true}), 200)
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
    this.timer = false
  }
  render() {
    if(this.props.show && this.state.show)
      return <i className="material-icons spin">autorenew</i>
    else
      return typeof this.props.children == 'string' ? <span>{this.props.children}</span> : this.props.children || null
  }
}

export function uniqueFilename(filename, array) {
  if(array.find(el => el == filename)){ //if filename already exists
    var split = filename.split('.')
    var index
    if(split.length > 1) {
      split.splice(split.length - 1, 0, 1)
      index = split.length - 2
    } else {
      split.push(1)
      index = split.length - 1
    }
    while(array.find(el => el == split.join('.')))
      split[index] += 1
    return split.join('.')
  }
  else
    return filename
}

export function dataFromURI(data) {
  window.data=data
  return data.slice(data.indexOf(',')+1)
}

export function Modal(props) {
  if(!props.open)
    return null
  return (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, .7)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <div className="card" style={{
          width: '700px',
          maxWidth: '95%'
        }}>
        <div className="card-content">
          {props.children}
        </div>
      </div>
    </div>
  )
}

export function Alert(props) {
  var className = 'alert alert-danger'
  if(props.type == 'warning') className = 'alert alert-warning'
  if(props.type == 'error') className = 'alert alert-danger'
  if(props.type == 'success') className = 'alert alert-success'
  return (
    <div className={className}>
      <span><b> {props.title || 'Error'} - </b> {props.children || 'An unexpected error has occurred.'}</span>
    </div>
  )
}

export function readFile(file) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error =>  reject(error)
  })
}

export function cacheUrl(file) {
  if(file && file.url && file.sha)
    if(file.url.indexOf('?') == -1)
     return Object.assign({}, file, {url: file.url + "?sha=" + file.sha})
    else
     return Object.assign({}, file, {url: file.url + "&sha=" + file.sha})
  else
    return file
}
