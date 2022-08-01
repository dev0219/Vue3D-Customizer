import { CONFIG } from "../../../../modules/Managers/ConfigManager";
import { hexToRgbA, mapColorToPalette } from "../../../../helpers/helpers";
import { ImageProcessor_v2 } from "./ImageProcessor_v2";

// this class process canvas into true color bitmap

class CanvasProcessor {

    constructor(codemap, safeArea) {

        this.width      = codemap.width
        this.height     = codemap.height

        this.programColors   = [{
            r: 0,
            g: 0,
            b: 0,
            a: 0
        }]
        this.colorValues     = [{r:0,g:0,b:0,a:0}]

        this.codemap    = codemap
        this.safeArea   = safeArea

        this.imageProcessor = new ImageProcessor_v2()
        this.createPaletteConversion()

        // Events registration
        //-----------------------------------------------------------

    }

    // create a table that synchronize colorValues with programColors,
    // as defined by 'value' and 'programColor' in structure config
    createPaletteConversion() {
        
        var structures = CONFIG.getStructuresConfig()

        structures.forEach(s => {

            let name = s.name

            if (name !== 'none') {

                var value = s.value
                var rgbArray = hexToRgbA(value)
                rgbArray.push(255)
                var rgbObject = {
                    r: rgbArray[0],
                    g: rgbArray[1],
                    b: rgbArray[2],
                    a: rgbArray[3],
                }
                this.colorValues.push(rgbObject)

                var programColor = s.programColor
                var rgbArray = hexToRgbA(programColor)
                rgbArray.push(255)
                this.programColors.push(rgbArray)

            }

        });
    }

    quantizeCanvas(canvas) {

        let ctx = canvas.getContext('2d')
        var imageData = ctx.getImageData(0, 0, this.width, this.height)
        ctx.imageSmoothingEnabled = false;

        var paletteObj = this.colorValues
        
        // TODO : maybe convert this to GLSL so it's faster
        var data = imageData.data
        for (var i = 0; i < data.length; i += 4) {

            var results = mapColorToPalette(
                data[i],
                data[i + 1],
                data[i + 2],
                data[i + 3],
                paletteObj);

            var mappedColor = results[0]

            data[i]     = mappedColor.r;
            data[i + 1] = mappedColor.g;
            data[i + 2] = mappedColor.b;
            data[i + 3] = mappedColor.a;

        }
        
        var newCanvas       = document.createElement('canvas')
        var newCtx          = newCanvas.getContext('2d')
        newCanvas.width     = this.width
        newCanvas.height    = this.height

        newCtx.putImageData(imageData, 0, 0);
        var quantizedCanvasData = this.layerCanvas(newCanvas)

        return quantizedCanvasData
        
    }

    layerCanvas(canvas) {

        var layeredCanvas     = document.createElement('canvas')
        layeredCanvas.width   = this.width
        layeredCanvas.height  = this.height
        let ctx = layeredCanvas.getContext('2d')
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.codemap, 0, 0)
        ctx.drawImage(canvas, 0, 0)
        ctx.drawImage(this.safeArea, 0, 0)

        var data = layeredCanvas.toDataURL()

        return data

    }

}

export { CanvasProcessor }