function Injection(iframe, editedContent) {
  function addJS(doc, src) {
    var script = doc.createElement("script")
    script.type = "text/javascript"
    script.src = src
    doc.body.appendChild(script)
    return script
  }
  function addCSS(doc, href) {
    var css = doc.createElement("link")
    css.rel = "stylesheet"
    css.type = "text/css"
    css.href = href
    doc.head.appendChild(css)
    return css
  }

  iframe.addEventListener('load', () => {
    var doc = iframe.contentWindow.document

    //css path relative to main window
    addCSS(doc, window.location.origin + window.location.pathname + "/quill.css")
    addJS(doc, "https://cdn.quilljs.com/1.2.0/quill.js")

    .onload = () => {
      var elements = doc.getElementsByClassName('editable')
      for(var i = 0; i < elements.length; i++){
        if(editedContent.length == elements.length)
          elements[i].innerHTML = editedContent[i]
        var quill = new iframe.contentWindow['Quill'](elements[i], {
          theme: 'bubble'
        });
      }
      for(var elements = doc.getElementsByTagName("a"), i = 0; i < elements.length; i++)
        elements[i].href="#"
    }
  })
}

export default Injection
