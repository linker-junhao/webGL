function createShader(gl, type, source) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader)
        return null
    }
    return shader
}

function getGlFromElement(el) {
    if(!(el instanceof HTMLElement || el instanceof String)) {
        throw 
    }
    let theCanvas = el

    if(!el instanceof HTMLElement) {
        theCanvas = document.querySelector(el)
    }
    return theCanvas.getContext("webgl2") ||
    theCanvas.getContext("webgl") ||
    theCanvas.getContext("experimental-webgl");
}

function attachShaderToProgram(gl, program, shaders) {
    shaders = Array.from(arguments).slice(2)
    shaders.forEach(shader => {
        gl.attachShader(program, shader)
    });
}

function xhrRequest(url, method = 'GET') {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open(method, url)
        xhr.responseType = "arraybuffer"
        xhr.onload = function(pro) {
            console.log(pro)
            if(this.status >= 200 && this.status < 300) {
                resolve(xhr.response)
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText,
                    xhr
                })
            }
        },
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText,
                xhr
            });
        };
        xhr.send();
    })
}

function bufferData(gl, target, data, usage, buffer) {
    if(!buffer) {
        buffer = gl.createBuffer()
    }
    gl.bindBuffer(target, buffer)
    gl.bufferData(target, data, usage)
    gl.bindBuffer(target, null)
    return buffer
}

const glUtils = {
    createShader,
    getGlFromElement,
    attachShaderToProgram,
    xhrRequest,
    bufferData
}