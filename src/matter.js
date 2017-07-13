/*import yaml from 'js-yaml'

function matter(string, options) {
  let res = {
    data: {},
    content: string
  }
  
  if(string.slice(0,3) !== '---')
    return res
    
  const end = string.indexOf('\n---')
  if(end === -1)
    return res
    
  res.data = yaml.safeLoad(string.slice(3, end - 1), options)
  res.content = string[end + 4] == '\n' ? string.slice(end + 5) : string.slice(end + 4)
  
  return res
}

matter.stringify = function(contents, data, options) {
  return '---\n' + yaml.safeDump(data, options) + '\n---\n' + contents
}

export default matter*/

import fm from 'front-matter'
import yaml from 'js-yaml'

function matter(str) {
  let out = fm(str)
  return {
    data: out.attributes,
    content: out.body
  }
}
matter.stringify = (obj) => '---\n' + yaml.safeDump(data) + '\n---\n' + contents

export default matter