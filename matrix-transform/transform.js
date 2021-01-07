// init var
const initVars = {
    translation: [0, 0],
    rotation: [0, 1],
    base: [[1, 0], [0, 1]],
    color: [Math.random(), Math.random(), Math.random(), 1],
    vertices: [
        // left column
        0, 0,
        30, 0,
        0, 150,
        0, 150,
        30, 0,
        30, 150,

        // top rung
        30, 0,
        100, 0,
        30, 30,
        30, 30,
        100, 0,
        100, 30,

        // middle rung
        30, 60,
        67, 60,
        30, 90,
        30, 90,
        67, 60,
        67, 90,
    ],
    elements: [0, 1, 2, 0, 2, 3],
    vertCode: `#version 300 es
    // init position
    in vec2 a_position;
    // size of canvas
    uniform vec2 u_resolution;
    // translation
    uniform vec2 u_translation;
    // rotation
    uniform vec2 u_rotation;
    // base
    uniform vec4 u_base;

    void main(void) {
        // base change
        vec2 basedPosition = vec2(
            a_position.x * u_base.x + a_position.y * u_base.y,
            a_position.x * u_base.z + a_position.y * u_base.w
        );

        // rotate add
        vec2 rotatedPosition = vec2(
            basedPosition.x * u_rotation.y + basedPosition.y * u_rotation.x,
            basedPosition.y * u_rotation.y - basedPosition.x * u_rotation.x
        );

        // translate add
        vec2 position = (rotatedPosition + u_translation);

        // convert the position to 0-1 space
        vec2 unitSpaceCoordinate = position / u_resolution;

        // conver 0-1 to -1-1
        vec2 clipSpace = unitSpaceCoordinate * 2.0 - 1.0;

        gl_Position = vec4(clipSpace * vec2(1, -1), 0.0, 1.0);
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
        canvasElem: null,
        glslVarLocation: {}
    },
    eventVal: {
        moveCenter: {
            x: 0,
            y: 0
        }
    },
    control: {
        translate: {
            x: document.querySelector('#translate-x-change'),
            y: document.querySelector('#translate-y-change')
        },
        rotate: {
            x: document.querySelector('#rotate-x-change'),
            y: document.querySelector('#rotate-y-change')
        },
        base: {
            x: document.querySelector('#base-x-change'),
            y: document.querySelector('#base-y-change')
        }
    }
}

function initGL() {
    const canvasElem = document.querySelector('#my-canvas')
    dataGeneratedByInit.gl.canvasElem = canvasElem
    const gl = glUtils.getGlFromElement('#my-canvas')
    dataGeneratedByInit.gl.gl = gl
    
    const shaderProgram = gl.createProgram()
    const vertShader = glUtils.createShader(gl, gl.VERTEX_SHADER, initVars.vertCode)
    const fragmentShader = glUtils.createShader(gl, gl.FRAGMENT_SHADER, initVars.fragmentCode)
    attachShaderToProgram(gl, shaderProgram, vertShader, fragmentShader)
    glUtils.linkAndUseProgram(gl, shaderProgram)


    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'a_position')
    const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, 'u_resolution')
    const translationLocation = gl.getUniformLocation(shaderProgram, "u_translation");
    const rotationLocation = gl.getUniformLocation(shaderProgram, 'u_rotation')
    const baseLocation = gl.getUniformLocation(shaderProgram, 'u_base')
    dataGeneratedByInit.gl.glslVarLocation = {
        positionAttributeLocation, resolutionUniformLocation, translationLocation, rotationLocation, baseLocation
    }

    const verticBuffer = glUtils.bufferData(gl, gl.ARRAY_BUFFER, new Float32Array(initVars.vertices), gl.STATIC_DRAW)
    dataGeneratedByInit.gl.verticBuffer = verticBuffer

    gl.bindBuffer(gl.ARRAY_BUFFER, verticBuffer)
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttributeLocation)
    drawScene()
}

function drawScene() {
    const gl = dataGeneratedByInit.gl.gl
    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.DEPTH_TEST)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.bindBuffer(gl.ARRAY_BUFFER, dataGeneratedByInit.gl.verticBuffer)

    gl.uniform2f(dataGeneratedByInit.gl.glslVarLocation.resolutionUniformLocation, 640, 640)

    gl.uniform2fv(dataGeneratedByInit.gl.glslVarLocation.translationLocation, initVars.translation)

    gl.uniform2fv(dataGeneratedByInit.gl.glslVarLocation.rotationLocation, initVars.rotation)

    gl.uniform4fv(dataGeneratedByInit.gl.glslVarLocation.baseLocation, initVars.base[0].concat(initVars.base[1]))

    gl.drawArrays(gl.TRIANGLES, 0, 18);
}

function initEvent() {
    dataGeneratedByInit.gl.canvasElem.onclick = moveToClickedPoint
    const translateControl = dataGeneratedByInit.control.translate
    const rotateControl = dataGeneratedByInit.control.rotate
    const baseControl = dataGeneratedByInit.control.base

    translateControl.x.oninput = translateXChange
    translateControl.y.oninput = translateYChange
    translateControl.x.value = initVars.translation[0]
    translateControl.y.value = initVars.translation[1]

    rotateControl.x.oninput = rotateXChange
    rotateControl.y.oninput = rotateYChange
    rotateControl.x.value = initVars.rotation[0]
    rotateControl.y.value = initVars.rotation[1]

    baseControl.x.oninput = baseChange.bind(baseControl.x, 0)
    baseControl.y.oninput = baseChange.bind(baseControl.y, 1)

}

function baseChange(idx = 0) {
    const val = this.value
    if(/^(\+|\-)?\d+,(\+|\-)?\d+/.test(val)) {
        initVars.base[idx] = this.value.split(',').map(p => parseInt(p))
        drawScene()
    }
}


function addMousemoveDraw() {
    dataGeneratedByInit.gl.canvasElem.onmousemove = moveToClickedPoint
}

function moveToClickedPoint(e) {
    initVars.translation[0] = e.offsetX
    initVars.translation[1] = e.offsetY
    moveToPoint()
}

function moveToPoint() {
    const translateControl = dataGeneratedByInit.control.translate
    translateControl.x.value = initVars.translation[0]
    translateControl.y.value = initVars.translation[1]
    drawScene()
}

function rotate() {
    const rotateControl = dataGeneratedByInit.control.rotate
    rotateControl.x.value = initVars.rotation[0]
    rotateControl.y.value = initVars.rotation[1]
    drawScene()
}

function translateXChange(e) {
    initVars.translation[0] = parseInt(this.value)
    moveToPoint(...initVars.translation)
}

function translateYChange(e) {
    initVars.translation[1] = parseInt(this.value)
    moveToPoint(...initVars.translation)
}

function rotateXChange(e) {
    initVars.rotation[0] = this.value
    rotate()
}

function rotateYChange(e) {
    initVars.rotation[1] = this.value
    rotate()
}

// rotation


initGL()
initEvent()


