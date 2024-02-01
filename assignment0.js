let gl, vao, program1, program2, currColor, currTriangles, maxTriangles, useJSON;

window.updateTriangles = function() {
    currTri = parseInt(document.querySelector("#triangles").value);
}

window.updateColor = function() {
    var r = parseInt(document.querySelector("#sliderR").value)/255.0;
    var g = parseInt(document.querySelector("#sliderG").value)/255.0;
    var b = parseInt(document.querySelector("#sliderB").value)/255.0;
    currColor = [r, g, b, 1.0];
    gl.clearColor(currColor[0], currColor[1], currColor[2], currColor[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

window.checkBox = function() {
    if (useJSON == false) {
        useJSON = true;
    } else {
        useJSON = false;
    }
}

function uploadFile(event) {
    // load file and create buffers
}

async function createPrograms() { 
    // create vertex and fragment shaders, create programs
}

function createShader(source, type) {
    // create shader
};

function createBuffer(vertices) {
    // create buffer
}

function createVAO(posAttribLoc, posBuffer, colAttribLoc, colBuffer) {
    // create vertex array
}

function draw() {

    // bind vao
    // use program
    // draw arrays
};

async function initialize() {
    // Setup global vars
    currColor = [0, 0, 0, 1.0];
    currTriangles = 1;
    maxTriangles = 1;
    useJSON = false;
    // initialive canvas
    var canvas = document.querySelector("#canvas");
    gl = canvas.getContext("webgl");
    gl.clearColor(currColor[0], currColor[1], currColor[2], currColor[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // create programs
    // draw
};
 
window.onload = initialize;
