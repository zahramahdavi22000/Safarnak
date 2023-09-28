function responseHandler(data) {

    try {

        if (data.constructor != Object) {
            data = JSON.parse(data)
        }

        if ('message' in data) {
            // M.toast({ html: data.message, classes: 'rounded' })
            alert(data.message)
        }

        if ('redirect' in data) {
            redirect(data.redirect)
        }

    } catch (e) {
        console.error(e)
    }
}


function redirect(url) {
    window.location.replace(url)
    // location.href = url
}

function replaceNWithBrLine(str) {
    return str.replace(new RegExp('\r?\n', 'g'), '<br />')
}

function insertHTML(html, dest, append = false) {
    // if no append is requested, clear the target element
    if (!append) dest.innerHTML = ''
    // create a temporary container and insert provided HTML code
    let container = document.createElement('div')
    container.innerHTML = html
    // cache a reference to all the scripts in the container
    let scripts = container.querySelectorAll('script')
    // get all child elements and clone them in the target element
    let nodes = container.childNodes
    for (let i = 0; i < nodes.length; i++) dest.appendChild(nodes[i].cloneNode(true))
    // force the found scripts to execute...
    for (let i = 0; i < scripts.length ;i++) {
        let script = document.createElement('script')
        script.type = scripts[i].type || 'text/javascript'
        if (scripts[i].hasAttribute('src')) script.src = scripts[i].src
        script.innerHTML = scripts[i].innerHTML
        document.head.appendChild(script)
        document.head.removeChild(script)
    }
    // done!
    return true
}

(() => {
    const includes = document.getElementsByTagName('include');
    [].forEach.call(includes, i => {
        let filePath = i.getAttribute('src'); fetch(filePath).then(file => {
            file.text().then(content => { insertHTML(content, i) })
        })
    })
})()

// decode utf-8
function encode_utf8(s) {
    return unescape(encodeURIComponent(s))
}

function decode_utf8(s) {
    return decodeURIComponent(escape(s))
}


/// getcookie 
function getCookie(name) {
    const value = ` ${document.cookie}`
    const parts = value.split(` ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}


// adeddd *************************************************************************************************************************

