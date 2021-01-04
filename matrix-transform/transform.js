// init var
const initVars = {
    translation: [0, 0],
    width: 100,
    height: 30,
    color: [Math.random(), Math.random(), Math.random(), 1],
    vertices: [
        -0.5, 0.5,
        -0.5, -0.5,
        0.5, -0.5,
        0.5, 0.5
    ],
    elements: [0, 1, 2, 0, 2, 3],
    vertCode: `#version 300 es
    layout (location = 0) in vec2 coordinates;

    void main(void) {
        gl_Position = vec4(coordinates, 0.0, 1.0);
    }
    `,
    fragmentCode: `#version 300 es
    precision highp float;

    out vec4 fragColor;
    void main(void) {
        fragColor = vec4(1.0, 1.0, 0.0, 1.0);
    }
    `
}

const dataGeneratedByInit = {
    gl: {
        gl: null,
        verticBuffer: null,
        elemBuffer: null,
        canvasElem: null
    },
    eventVal: {
        moveCenter: {
            x: 320,
            y: 320
        }
    },
    control: {
        x: document.querySelector('#x-change'),
        y: document.querySelector('#y-change')
    }
}

function initGL() {
    const canvasElem = document.querySelector('#my-canvas')
    dataGeneratedByInit.gl.canvasElem = canvasElem
    const gl = glUtils.getGlFromElement('#my-canvas')
    dataGeneratedByInit.gl.gl = gl
    const verticBuffer = glUtils.bufferData(gl, gl.ARRAY_BUFFER, new Float32Array(initVars.vertices), gl.STATIC_DRAW)
    const elemBuffer = glUtils.bufferData(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(initVars.elements), gl.STATIC_DRAW)
    dataGeneratedByInit.gl.verticBuffer = verticBuffer
    dataGeneratedByInit.gl.elemBuffer = elemBuffer
    
    const shaderProgram = gl.createProgram()
    const vertShader = glUtils.createShader(gl, gl.VERTEX_SHADER, initVars.vertCode)
    const fragmentShader = glUtils.createShader(gl, gl.FRAGMENT_SHADER, initVars.fragmentCode)
    attachShaderToProgram(gl, shaderProgram, vertShader, fragmentShader)

    glUtils.linkAndUseProgram(gl, shaderProgram)


    gl.clearColor(0.5, 0.5, 0.5, 0.9)
    gl.enable(gl.DEPTH_TEST)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.bindBuffer(gl.ARRAY_BUFFER, verticBuffer)
    const coordinatesLoc = gl.getAttribLocation(shaderProgram, 'coordinates')
    gl.vertexAttribPointer(coordinatesLoc, 2, gl.FLOAT, false, 8, 0)
    gl.enableVertexAttribArray(coordinatesLoc)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elemBuffer)
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
}

function initEvent() {
    dataGeneratedByInit.gl.canvasElem.onclick = moveToClickedPoint
    controlX = dataGeneratedByInit.control.x
    controlY = dataGeneratedByInit.control.y
    controlX.oninput = xChange
    controlY.oninput = yChange
    controlX.value = dataGeneratedByInit.eventVal.moveCenter.x
    controlY.value = dataGeneratedByInit.eventVal.moveCenter.y
}

function addMousemoveDraw() {
    dataGeneratedByInit.gl.canvasElem.onmousemove = moveToClickedPoint
}

function moveToClickedPoint(e) {
    moveToPoint(e.offsetX, e.offsetY)
}

function moveToPoint(x, y) {
    const gl = dataGeneratedByInit.gl.gl
    const center = glUtils.projectPxPosToGlSpace(gl, x, y)
    const tranformedRet = initVars.vertices.map((poi, idx) => {
        if((idx + 1) % 2 === 0) {
            // y
            return poi + center.y
        }
        // x
        return poi + center.x
    })

    gl.clearColor(0.5, 0.5, 0.5, 0.9)
    gl.enable(gl.DEPTH_TEST)
    gl.clear(gl.COLOR_BUFFER_BIT)
    const buffer = glUtils.bufferData(gl, gl.ARRAY_BUFFER, new Float32Array(tranformedRet), gl.STATIC_DRAW, dataGeneratedByInit.gl.verticBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
}

function xChange(e) {
    const params = dataGeneratedByInit.eventVal.moveCenter
    params.x = parseInt(this.value)
    moveToPoint(params.x, params.y)
}

function yChange(e) {
    const params = dataGeneratedByInit.eventVal.moveCenter
    params.y = parseInt(this.value)
    moveToPoint(params.x, params.y)
}

// rotation


initGL()
initEvent()


