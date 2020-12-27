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

function isStringObject(val) {
    return Object.prototype.toString.call(val) === '[object String]'
}

function getGlFromElement(el) {
    if(!(el instanceof HTMLElement || isStringObject(el))) {
        throw new Error('the el param expeted an element or seletor')
    }
    let theCanvas = el

    if(!(el instanceof HTMLElement)) {
        theCanvas = document.querySelector(el)
    }
    const gl = theCanvas.getContext("webgl2") ||
    theCanvas.getContext("webgl") ||
    theCanvas.getContext("experimental-webgl");

    gl.viewport(0, 0, theCanvas.width, theCanvas.height)

    return gl
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

function linkAndUseProgram(gl, program) {
    gl.linkProgram(program)
    gl.useProgram(program)
}

function projectPxPosToGlSpace(gl, x, y) {
    const viewport = gl.getParameter(gl.VIEWPORT);
    const halfX = viewport[2] / 2
    const halfY = viewport[3] / 2
    return {
        x: (x - halfX) / halfX,
        y: - (y - halfY) / halfY
    }
}

const glUtils = {
    createShader,
    getGlFromElement,
    attachShaderToProgram,
    xhrRequest,
    bufferData,
    linkAndUseProgram,
    projectPxPosToGlSpace
}