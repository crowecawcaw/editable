import React from 'react'
import Cheerio from 'cheerio'
import { hashHistory, Link } from 'react-router'
import {render} from 'react-dom'

import Injection from './HTMLEditorInjection.jsx'

class HTMLEditor extends React.Component {
  constructor() {
    super()
    this.save = this.save.bind(this)
  }
  componentWillMount() {
    this.$ = Cheerio.load(this.props.content)
  }
  componentWillUnmount() {
    this.props.onChange(this.save())
  }
  save() {
    const originalEditables = this.iframeElement.contentWindow.document.getElementsByClassName('editable')
    const newEditables = this.$('.editable')

    if(originalEditables.length != newEditables.length)
      throw new Error('Number of edits and number of editable fields do not match.')

    for(var i = 0; i < newEditables.length; i++)
      this.$(newEditables[i]).html(originalEditables[i].firstChild.innerHTML)
    return this.$.html()
  }
  render() {
    return (
      <iframe
        style={{
          margin: '1em',
          background: '#fff',
          width: '100%',
          border: '2px solid rgba(128, 128, 128, .6)'
        }}
        src={'../' + this.props.permalink}
        ref={ input => {
          if(!input || this.iframeElement)
            return
          this.iframeElement = input;
          var editables = this.$('.editable')
          var editedContent = []
          for(var i = 0; i < editables.length; i++)
            editedContent[i] = this.$(editables[i]).html()
          Injection(input, editedContent)
        }}>
      </iframe>
    )
  }
}

export default HTMLEditor