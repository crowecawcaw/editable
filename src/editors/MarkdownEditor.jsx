import React from 'react'
import RichTextEditor from 'react-rte'

class MarkdownEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: RichTextEditor.createValueFromString(this.props.content ||'', 'markdown')
    }
    this.save = this.save.bind(this)
  }
  componentWillUnmount() {
    this.props.onChange(this.save())
  }
  save() {
    console.log(this.state.value.toString('markdown').split(String.fromCharCode(8203)).join("\n"))
    return this.state.value.toString('markdown').split(String.fromCharCode(8203)).join("\n")
  }
  render() {
    return (
      <RichTextEditor className="full-width background-clear" key={'editor'} value={this.state.value} onChange={v => {
          this.setState({value: v})
        }} />
    )
  }
}


export default MarkdownEditor