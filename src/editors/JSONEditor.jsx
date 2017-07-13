import React from 'react'
import DatePicker from 'react-datepicker'
import Moment from 'moment'

require('react-datepicker/dist/react-datepicker.css');

export default function JSONEditor(props) {
  var onUpdate = (selector, data) => {
    var newValue = Object.assign({}, props.value)
    var el = newValue
    for(var i = 0; i < selector.length - 1; i++)
        el = el[selector[i]]
    el[selector[selector.length - 1]] = data
    props.onChange(newValue)
  }

  return (
      <EditObject
        schema={Object.assign({}, props.value.schema || {}, {title: props.title || ''})}
        value={props.value}
        onUpdate={onUpdate}
        selector={[]} />
    )
}

function EditObject(props) {
  var out = []
  for(var key in props.schema) {
    const schema = Object.assign({}, props.schema[key], {key: key})
    const nextProps = {
      key: key,
      schema: schema,
      value: props.value[key] || null,
      selector: props.selector.concat(key),
      onUpdate: props.onUpdate
    }
    
    if(!schema.type || schema.type == 'text')
      out.push( <EditText {...nextProps}/> )
    else if(schema.type == 'object')
      out.push( <EditObject {...nextProps}/> )
    else if(schema.type == 'select')
      out.push( <EditSelect {...nextProps}/> )
    else if(schema.type == 'array')
      out.push( <EditArray {...nextProps}/> )
    else if(schema.type == 'date')
      out.push( <EditDate {...nextProps}/> )
    else if(schema.type == 'number')
      out.push( <EditNumber {...nextProps}/> )
      
  }
  const title = props.schema.title || props.schema.key
  return (
    <div className="json-group">
      {title ? <h4 style={{paddingTop: '1em'}}>{title}</h4> : null}
      {out}
    </div>
  )
}

function EditArray(props) {
  var items = props.value.map((item, i) => {
    const nextProps = {
      key: i,
      schema: props.schema.items,
      value: props.value[i] || null,
      selector: props.selector.concat(i),
      onUpdate: props.onUpdate
    }
    
    const arraySwap = (array, i1, i2) => {
      if(!(i1 >= 0 && i2 >= 0 && i1 < array.length && i2 < array.length))
        return array.concat()

      let out = array.concat()
      out[i1] = array[i2]
      out[i2] = array[i1]
      return out
    }
    const moveUp = () => props.onUpdate(props.selector, arraySwap(props.value, i, i-1))
    const moveDown = () => props.onUpdate(props.selector, arraySwap(props.value, i, i+1))
    const add = () => props.onUpdate(props.selector, props.value.slice(0, i+1).concat({}, props.value.slice(i+1, props.value.length)))
    const remove = () => props.onUpdate(props.selector, props.value.slice(0, i).concat(props.value.slice(i+1, props.value.length)))
    
    const buttonStyle = {padding: '5px 10px', margin: '2px 0'}
    return (
      <div key={i} style={{display: 'flex'}}>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}} >
          <button className="json-array-btn" onClick={moveUp} style={buttonStyle} >
            <i className="material-icons">keyboard_arrow_up</i>
          </button>
          <button className="json-array-btn" onClick={add} style={buttonStyle} >
            <i className="material-icons">library_add</i>
          </button>
          <button className="json-array-btn" onClick={remove} style={buttonStyle} >
            <i className="material-icons">delete_forever</i>
          </button>
          <button className="json-array-btn" onClick={moveDown} style={buttonStyle} >
            <i className="material-icons">keyboard_arrow_down</i>
          </button>
        </div>
        <div style={{flex: '1 0 auto', marginLeft: '1em'}}>
          <EditObject {...nextProps} />
        </div>
      </div>
    )
  })
  return (
    <div className="json-group">
       <h4 style={{paddingTop: '1em'}}>{props.schema.title || props.schema.key}</h4>
      {items}
    </div> 
  )
}

function EditText(props) {
  const onChange = (e) => props.onUpdate(props.selector, e.target.value)
  return (
    <div className="input-group label-floating">
      <label className="control-label">{props.schema.title || props.schema.key}</label>
      <input
        type="text"
        className="form-control"
        value={props.value != null ? props.value : ''}
        onChange={onChange} />
    </div>
  )
}

function EditSelect(props) {
  const onChange = (e) => props.onUpdate(props.selector, e.target.value)
  const options = (props.schema.options || []).map(option => {
    if(option !=null && typeof(option) == 'object' && option.hasOwnProperty('value'))
      return <option key={option.value} value={option.value}>{option.title || option.value}</option>
    else
      return <option key={option} value={option}>{option}</option>
  })
  return (
    <div className="input-group">
      <label className="control-label">{props.schema.title || props.schema.key}</label>
      <select className="form-control" value={props.value} onChange={onChange} style={{width: '100%', border: '1px solid #eee', backgroundImage: 'none'}}>
        {options}
      </select>
    </div>
  )
}

function EditDate(props) {
  let date = Moment(props.value)
  if(!date.isValid())
    date = Moment()
    
  const onChange = (moment) => props.onUpdate(props.selector, moment.format('YYYY-MM-DD'))
  
  return (
    <div className="input-group">
      <label className="control-label" style={{display: 'block'}}>{props.schema.title || props.schema.key}</label>
      <DatePicker dateFormat="YYYY-MM-DD" selected={date} onChange={onChange} className="form-control" />
    </div>
  )
}

function EditNumber(props) {
  const onChange = (e) => props.onUpdate(props.selector, e.target.value)
  
  let inputProps = {}
  inputProps.step = props.schema.float == true ? 'any' : '1'
  if(typeof props.schema.min !== 'undefined')
    inputProps.min = props.schema.min
  if(typeof props.schema.max !== 'undefined')
    inputProps.max = props.schema.max
    
  return (
    <div className="input-group label-floating">
      <label className="control-label">{props.schema.title || props.schema.key}</label>
      <input
        type="number"
        className="form-control"
        value={props.value != null ? props.value : ''}
        onChange={onChange}
        {...inputProps} />
    </div>
  )
}

function EditPicture(props) {
  return <EditText {...props} />
}
