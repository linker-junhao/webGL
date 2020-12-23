// init var
const initVars = {
    translation: [0, 0],
    width: 100,
    height: 30,
    color: [Math.random(), Math.random(), Math.random(), 1],
    vertices: [
        -0.5, 0.5, 0.0, 2.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, -0.5, 2.0, 0.0,
        0.5, 0.5, 2.0, 2.0
    ],
    elements: [0, 1, 2, 0, 2, 3],
    vertCode: `#version 300 es
    layout (location = 0) in vec2 coordinates;
    layout (location = 1) in vec2 aTextureCoord;
    out highp vec2 vTextureCoord;

    void main(void) {
        gl_Position = vec4(coordinates, 0.0, 1.0);
        vTextureCoord = aTextureCoord;
    }
    `,
    fragmentCode: `#version 300 es
    precision lowp float;
    in highp vec2 vTextureCoord;
    uniform sampler2D texSample;
    uniform sampler2D texSample2;

    out vec4 fragColor;
    void main(void) {
        FragColor = mix(texture(texSample, vec2(1.0, 1.0) - vTextureCoord), texture(texSample2, vec2(1.0, 1.0) - vTextureCoord), 0.6)
    }
    `
}

function drawScene() {
    const gl = glUtils.getGlFromElement('#my-canvas')
    glUtils.bufferData(gl, gl.ARRAY_BUFFER, new Float32Array(initVars.vertices), gl.STATIC_DRAW)
    glUtils.bufferData(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(initVars.elements), gl.STATIC_DRAW)
    
    const shaderProgram = gl.createProgram()
    const vertShader = glUtils.createShader
    attachShaderToProgram(gl, shaderProgram, initVars.ver)
}


