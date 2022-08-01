// import {  utils, applyPalette, buildPalette} from "image-q/dist/umd/image-q"
import { p_vs_src, p_fs_src } from './PaletteApplierShaders.js'
import * as iq from 'image-q';

class ImageProcessor_v2 {

    constructor() {

    }

    // Make sure image are resized and formatted according to config
    async process(image, config) {

        var buildConfig = {}
        var applyConfig = {}

        if (config.colorDistanceFormula)
            buildConfig.colorDistanceFormula    = config.colorDistanceFormula
        if (config.paletteQuantization)
            buildConfig.paletteQuantization     = config.paletteQuantization
        buildConfig.colors                  = config.colors

        if (config.colorDistanceFormula)
            applyConfig.colorDistanceFormula    = config.colorDistanceFormula  
        if (config.imageQuantization)
            applyConfig.imageQuantization       = config.imageQuantization

        const inPointContainer = iq.utils.PointContainer.fromHTMLImageElement(image)

        var palette;

        // if (config.palette) {
        //     palette = config.palette
        // } else {
        //     palette = await buildPalette([inPointContainer], buildConfig);
        // }

        palette = await iq.buildPalette([inPointContainer], buildConfig);

        const outPointContainer = await iq.applyPalette(inPointContainer, palette, applyConfig);

        var newImageData = Uint8ClampedArray.from(outPointContainer.toUint8Array())

        return new Promise((resolve, reject) => {

            resolve({newImageData, palette})

        })

    }

    buildPalettePoint(value) {

        var rgba = value.rgba
        var r = rgba.r
        var g = rgba.g
        var b = rgba.b
        var a = rgba.a

        return iq.utils.Point.createByRGBA(r, g, b, a)
        
    }

    async applyPaletteToImage(image, palette, config) {

        var iqPalette = new iq.utils.Palette()

        for (const p in palette) {
            iqPalette.add(palette[p])
        }

        const inPointContainer = iq.utils.PointContainer.fromHTMLImageElement(image)
        const outPointContainer = await iq.applyPalette(inPointContainer, iqPalette, config);

        var newImageData = Uint8ClampedArray.from(outPointContainer.toUint8Array())

        return new Promise((resolve, reject) => {

            resolve(newImageData)

        })
    }

    // convert paletted image to colors as defined in colorArrangement 
    convertToColorArrangement(image, palette, colorArrangements, width, height) {
        
        var canvas     = document.createElement('canvas')
        canvas.width   = width
        canvas.height  = height
        var ctxt       = canvas.getContext('webgl')
        
        ctxt.viewport(0, 0, ctxt.drawingBufferWidth, ctxt.drawingBufferHeight);
        ctxt.clear(ctxt.COLOR_BUFFER_BIT);

        var vs = ctxt.createShader(ctxt.VERTEX_SHADER);
        var fs = ctxt.createShader(ctxt.FRAGMENT_SHADER);

        var fragShader = [
            'precision highp float;',
            'uniform sampler2D textureSampler;',
            'varying vec2 texCoords;',
        ]

        for(var j = 0; j < palette.length; j++) {
            var p = palette[j]
            var c = colorArrangements[j]

            var prgba = p.r + '.0,' + p.g + '.0,' + p.b + '.0,' + p.a + '.0';
            var crgba = c[0] + '.0,' + c[1] + '.0,' + c[2] + '.0,' + c[3] +'.0';
            fragShader.push('const vec4 rep' + j + '= vec4(' + prgba + ');')
            fragShader.push('const vec4 new' + j + '= vec4(' + crgba + ');')
        }

        fragShader.push('void main() {')
        fragShader.push('vec4 ci = texture2D(textureSampler, texCoords);')
        fragShader.push('vec4 test = ci * 255.0;')

        for (var k = 0; k < palette.length; k++) {
            var paletteCond = 'if (test == rep' + k + ') { test = new' + k + ';}'
            fragShader.push(paletteCond)
        }
        
        fragShader.push('gl_FragColor = test / 255.0; }')
        fragShader = fragShader.join( '\n' )

        ctxt.shaderSource(vs, p_vs_src);
        ctxt.shaderSource(fs, fragShader);
        ctxt.compileShader(vs);
        ctxt.compileShader(fs);

        var program = ctxt.createProgram();
        ctxt.attachShader(program, vs);
        ctxt.attachShader(program, fs);
        ctxt.linkProgram(program);
        ctxt.useProgram(program);

        var vertexBuffer = ctxt.createBuffer();
        ctxt.bindBuffer(ctxt.ARRAY_BUFFER, vertexBuffer);
        var vertices = new Float32Array([
            -1, -1,
            -1, 1,
            1, 1,
            -1, -1,
            1, 1,
            1, -1,
        ]);

        ctxt.bufferData(ctxt.ARRAY_BUFFER, vertices, ctxt.STATIC_DRAW);
        var positionLocation = ctxt.getAttribLocation(program, "position");
        ctxt.vertexAttribPointer(positionLocation, 2, ctxt.FLOAT, false, 0, 0);
        ctxt.enableVertexAttribArray(positionLocation);
        
        var tex = ctxt.createTexture();
        ctxt.activeTexture(ctxt.TEXTURE0);
        ctxt.bindTexture(ctxt.TEXTURE_2D, tex);
        ctxt.texImage2D(ctxt.TEXTURE_2D, 0, ctxt.RGBA, ctxt.RGBA, ctxt.UNSIGNED_BYTE, image);
        ctxt.texParameteri(ctxt.TEXTURE_2D, ctxt.TEXTURE_WRAP_S, ctxt.CLAMP_TO_EDGE);
        ctxt.texParameteri(ctxt.TEXTURE_2D, ctxt.TEXTURE_WRAP_T, ctxt.CLAMP_TO_EDGE);
        ctxt.texParameteri(ctxt.TEXTURE_2D, ctxt.TEXTURE_MIN_FILTER, ctxt.NEAREST);
        ctxt.texParameteri(ctxt.TEXTURE_2D, ctxt.TEXTURE_MAG_FILTER, ctxt.NEAREST);
        ctxt.drawArrays(ctxt.TRIANGLES, 0, 6);

        return canvas
    }

}

export { ImageProcessor_v2 }