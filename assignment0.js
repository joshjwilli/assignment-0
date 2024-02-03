const vertexShaderSrc =
    "#version 300 es\n" +
    "in vec2 position;\n" +
    "in vec4 color;\n" +
    "out vec4 vColor;\n" +
    "void main() {\n" +
    "   vColor = color;\n" +
    "   gl_Position = vec4(position.xy, 0, 1);\n" +
    "}\n"

const fragmentShaderSrc =
    "#version 300 es\n" +
    "precision highp float;\n" +
    "in vec4 vColor;\n" +
    "out vec4 outColor;\n" +
    "void main() {\n" +
    "   outColor = vColor;\n" +
    "}\n";

const fragmentShaderSrc2 =
    "#version 300 es\n" +
    "precision highp float;\n" +
    "in vec4 vColor;\n" +
    "out vec4 outColor;\n" +
    "uniform vec4 uColor;\n" +
    "void main() {\n" +
    "   outColor = uColor;\n" +
    "}\n";

let gl, vao, program1, program2, currColor, currTri,
    maxTri, positions, colors, uniformLoc, fileLoad;

window.updateTriangles = function () {
    currTri = parseInt(document.querySelector("#triangles").value);
}

window.updateColor = function () {
    var r = parseInt(document.querySelector("#sliderR").value) / 255.0;
    var g = parseInt(document.querySelector("#sliderG").value) / 255.0;
    var b = parseInt(document.querySelector("#sliderB").value) / 255.0;

    currColor = [r, g, b, 1.0];
}

window.checkBox = function () {
    if (useJSON == false) {
        useJSON = true;
    } else {
        useJSON = false;
    }
}

function uploadFile(event) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const fileContent = e.target.result;

            try {
                const jsonData = JSON.parse(fileContent);

                if (jsonData.positions && jsonData.colors) {
                    positions = jsonData.positions;
                    colors = jsonData.colors;

                    maxTri = positions.length / 3;
                    document.getElementById("triangles").max = maxTri;

                    // create programs
                    createPrograms();
                    fileLoad = true;
                } else {
                    alert("Invalid JSON format. Missing 'positions' or 'colors'.");
                }
            } catch (error) {
                alert("Error parsing JSON:" + error);
            }
        };
        reader.readAsText(selectedFile);
    } else {
        console.log("No file selected?");
    }
}

async function createPrograms() {
    // create vertex and fragment shaders, create programs
    var vertexShader = createShader(vertexShaderSrc, gl.VERTEX_SHADER);
    var fragmentShader = createShader(fragmentShaderSrc, gl.FRAGMENT_SHADER);
    var fragmentShader2 = createShader(fragmentShaderSrc2, gl.FRAGMENT_SHADER);

    program1 = createProgram(vertexShader, fragmentShader);
    program2 = createProgram(vertexShader, fragmentShader2);

    var posBuffer = createBuffer(positions);
    var colorBuffer = createBuffer(colors);
    var posAttribLoc = gl.getAttribLocation(program1, "position");
    var colorAttribLoc = gl.getAttribLocation(program1, "color");
    uniformLoc = gl.getUniformLocation(program2, 'uColor');

    vao = createVAO(posAttribLoc, colorAttribLoc, posBuffer, colorBuffer);
}

function createProgram(vertexShader, fragmentShader) {
    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(program);
        console.log('Could not compile WebGL program:' + info);
    }
    return program;
}

function createShader(source, type) {
    // create shader
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        console.log('Could not compile WebGL ' + type + ' :' + info);
    }
    return shader;
};

function createBuffer(vertices) {
    // create buffer
    var buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    return buffer;
}

function createVAO(posAttribLoc, colAttribLoc, posBuffer, colBuffer) {
    // create vertex array
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.enableVertexAttribArray(posAttribLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.vertexAttribPointer(posAttribLoc, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(colAttribLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, colBuffer);
    gl.vertexAttribPointer(colAttribLoc, 4, gl.FLOAT, false, 0, 0);

    return vao;
}

function draw() {
    gl.clearColor(currColor[0], currColor[1], currColor[2], currColor[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    if (fileLoad) {
        // use program
        if (useJSON) {
            gl.useProgram(program1);
        } else {
            gl.useProgram(program2);
            gl.uniform4fv(uniformLoc, new Float32Array(currColor));
        }

        // bind vao
        gl.bindVertexArray(vao);
        // draw arrays
        gl.drawArraysInstanced(gl.TRIANGLES, 0, currTri, 3);
    }

    requestAnimationFrame(draw);
};

async function initialize() {
    // Setup global vars
    currColor = [0.0, 0.0, 0.0, 1.0];
    currTri = 0;
    maxTri = 0;
    useJSON = true;
    fileLoad = false;

    // initialive canvas
    var canvas = document.querySelector("#canvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    gl = canvas.getContext("webgl2");
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    document.getElementById('jsonFile').addEventListener('input', function (event) {
        uploadFile(event);
    });

    // draw
    window.requestAnimationFrame(draw);
};

window.onload = initialize;
