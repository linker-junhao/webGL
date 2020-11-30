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

function attachShaderToProgram(gl, program, shaders) {
    shaders = Array.from(arguments).slice(2)
    shaders.forEach(shader => {
        gl.attachShader(program, shader)
    });
}