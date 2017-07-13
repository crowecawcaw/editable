import React from 'react'
import 'whatwg-fetch'

import GitApi from './GitApi.jsx'
import Login from './Login.jsx'
import update from 'immutability-helper'
import { getSiteData, readFile, dataFromURI, resizeImage, cacheUrl, uniqueFilename } from './utils.jsx'
import matter from './matter.js'

class DataStore extends React.Component {
  constructor() {
    super()
    
    this.state = {
      pages: [],
      posts: [],
      images: [],
      settings: {},
      toast: null
    }
  }
  componentWillMount() {
    getSiteData()
    .then(data => new Promise((resolve, reject) => {
      const settings = Object.assign({}, {
        defaultSchema: {},
        imageDirectory: 'images'
      }, data.settings)
      this.setState({
        settings: settings,
        lastBuildTime: data.buildTime,
        pages: data.map.pages,
        posts: data.map.posts
      }, resolve)
    }))
    .then(() => Promise.all([
      this.props.api.getDirectory(this.state.settings.imageDirectory)
        .then(images => images.filter(img => img.type == 'file')), 
      this.props.api.getDirectory(this.state.settings.imageDirectory + '/thumbnails')
        .then(images => images.filter(img => img.type == 'file')),
      this.props.api.getDirectory(this.state.settings.imageDirectory + '/masters')
        .then(images => images.filter(img => img.type == 'file'))
    ]))
    .then(allImages => allImages.map(images => images.map(cacheUrl)))
    .then(allImages => {
      const images = allImages[0]
      const thumbs = allImages[1]
      const masters = allImages[2]
      return images.map(img => {
        const thumbnail = thumbs.find(th => th.name == img.name) || false
        const master = masters.find(m => m.name == img.name) || false
        return Object.assign({}, img, {thumbnail: thumbnail, master: master})
      })
    })
    .then(images => new Promise((resolve, reject) => this.setState({images: images}, resolve)))
  }
  
  editPage(path, content, post = false) {
    return this.parsePage(content)
    .then(page => {
      return this.props.api.updateFile(this.props.path, content)
      .then(() => new Promise((resolve, reject) => {
        const index = pages.findIndex(p => p.path == path)
        if(index >= 0)
          this.setState({pages: update(this.state.pages, {[index]: {$set: page} })}, resolve)
        else
          reject()
      }))
    })
  }
  renamePage(path) {
    return
  }
  
  addPage(path, content) {
    return this.addPage(path, content, 'page').bind(this)
  }
  addPost(path, content) {
    return this.addPage(path, content, 'path').bind(this)
  }
  addFile(path, content, listName) {
    return this.parseFile(path, content)    
    .then(fileData => {
      return this.props.api.createFile(path, content)
      .then(() => new Promise((resolve, reject) =>
        this.setState({
          [listName]: update(this.state[listName], {$push: [fileData] })
      }, resolve)
      ))
    })
  }
  parseFile(path, content, post = false) {
    return new Promise((resolve, reject) => {
      const data = matter(content).data
      if(!data.title)
        throw 'Pages must have a title.'
      let page = {}
      page.title = data.title
      if(data.permalink)
        page.permalink = data.permalink
      page.url = page.permalink || path
      resolve(page)
    })    
  }

  
  removePage(path) {
    return this.removeFile(path, 'pages').bind(this)
  }
  removePost(path) {
    return this.removeFile(path, 'posts').bind(this)
  }
  removeImage(path) {
    return this.removeFile(path, 'images').bind(this)
  }
  removeFile(path, listName) {
    const list = this.state[listName]
    return this.props.api.deleteFile(path)
    .then(() => new Promise((resolve, reject) => {
      const index = list.findIndex(el => el.path == path)
      if(index >= 0)
        this.setState({[listName]: update(list, {$splice: [[index, 1]] })}, resolve)
      else
        reject()
    }))
  }
  
  /////////////////////
  // IMAGE FUNCTIONS //
  /////////////////////

  addImage(file, inputFilename = false) {
    const filename = uniqueFilename(inputFilename || file.name, this.state.images.map(img => img.name))
    const path = this.state.settings.imageDirectory + '/' + filename
    const thumbPath = this.state.settings.imageDirectory + '/thumbnails/' + filename
    
    let imgObject, imgUri
    return (file instanceof File ? readFile(file) : new Promise((resolve, reject) => resolve(file)))
    .then(uri => imgUri = uri)
    .then(() => this.props.api.createFile(path, dataFromURI(imgUri), false))
    .then(cacheUrl)
    .then(result => imgObject = result)
    .then(() => resizeImage(imgUri, {maxWidth: 300, maxHeight: 300}))
    .then(thumbUri => this.props.api.createFile(thumbPath, dataFromURI(thumbUri), false))
    .then(cacheUrl)
    .then(result => imgObject.thumbnail = result)
    .then(() => console.log(imgObject))
    .then(() => new Promise((resolve, reject) =>
      this.setState({images: update(this.state.images, {$push: [imgObject] })})
    ))
  }
  
  getChildContext() {
    var pages = this.state.pages.concat()
    pages.add = this.addPage.bind(this)
    pages.remove = this.removePage.bind(this)
    //pages.rename = this.renamePage.bind(this)
    pages.edit = this.editPage.bind(this)

    var posts = this.state.posts.concat()
    pages.add = this.addPost.bind(this)
    pages.remove = this.removePost.bind(this)
    //pages.rename = this.renamePage.bind(this)
    //pages.edit = this.editPage.bind(this)

    var images = this.state.images.concat()
    images.add = this.addImage.bind(this)
    images.remove = this.removeImage.bind(this)
    
    return {
      api: this.props.api,
      pages: pages,
      posts: posts,
      images: images,
      settings: this.state.settings,
      toast: this.state.toast
    }
  }
  
  render() {
    return this.props.children 
  }
}

DataStore.childContextTypes = {
  api: React.PropTypes.object.isRequired,
  pages: React.PropTypes.array.isRequired,
  posts: React.PropTypes.array.isRequired,
  images: React.PropTypes.array.isRequired,
  settings: React.PropTypes.object.isRequired,
  toast: React.PropTypes.string
}

export default DataStore