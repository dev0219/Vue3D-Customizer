// following this documentation https://github.com/troisjs/trois/issues/92

import { DoubleSide } from 'three'
import { Color } from 'three'
import { StandardMaterial } from 'troisjs'
// fillMap processing shaders
import { fillMapFrag, fillMapVert } from './shaders/FillMapShaders.js'
// shader fragments for onBeforeCompile
import { calcDiffuse, calcDiffuseColor, calcDitheringParsFrag, calcFragStandard, calcNormalFragmentMaps, calcVertMain, calcVertStandard } from './shaders/MaterialShaders.js'
import { mapState } from 'vuex'
import { NearestFilter, LinearMipMapNearestFilter, CanvasTexture, UVMapping } from 'three'

export default {
  extends: StandardMaterial,

  data() {

    return {
      
      colors          : {},
      fillMap         : null,      // buffer for fill map
      layersCanvas    : null,      // buffer for 2D canvas to show layers and UV map
      overlayCanvas   : null,      // buffer for 2D canvas overlay canvas
      image           : null, // buffer from process canvas
      fillMap         : null,

    }

  },

  // props: ['yarns', 'canvasImage'],

  computed:{
    ...mapState({
      yarns: state => state.yarns.all,
    }),
    ...mapState({
      canvasImage: state => state.utils.all.canvasImage,
    }),
  },

  watch: {

    yarns: {
      deep : true,
      handler() {
        console.log('new yarn')
        this.processColorArrangement(this.canvasImage, this.yarns)
      }
    },

    canvasImage: {
      deep : true,
      handler() {
        console.log('new image')
        this.processColorArrangement(this.canvasImage, this.yarns)
      }
    },
    

  },

  methods: {

    processColorArrangement(canvasImage, yarns) {

      var colors = []
      yarns.forEach( yarn => {

        let activeValue  = yarn.params.value
        let activeObject = yarn.params.options.filter(op => op.value == activeValue)
        let activeColor  = activeObject[0].color

        colors.push(activeColor)
        
      });

      this.processCanvas(canvasImage, colors)
      
    },

    processCanvas(canvasImage, colors) {

      let imageData = null

        if (canvasImage !== null) {

            imageData = canvasImage

        }  else {

          imageData = this.canvasImage

        }

        if (imageData !== null) {

            const img = new Image()
            img.src = imageData;
            img.onload = () => {
                this.$data.image = img
                this.processMaterials(img, colors)
            }

        }

    },

    processMaterials(image, colors) {

      this.material.dispose();

      // default values if color unset in UI
      let color_1 = { r: 0.0352941176470588, g: 0.0392156862745098, b: 0.0274509803921568 }
      let color_2 = { r: 0.9607843137254902, g: 0.9529411764705882, b: 0.8901960784313725 }

      if (colors[0]) color_1 = this.convertHexToRGB(colors[0])
      if (colors[1]) color_2 = this.convertHexToRGB(colors[1])

      const webgl2Enabled = this.getWebgl2Compatibility()
      const fillMap       = this.generateFillMap(image)
      const fillMapCanvas = fillMap.canvas

      const magFilter = NearestFilter
      const minFilter = LinearMipMapNearestFilter

      var texture = new CanvasTexture(fillMapCanvas)
        
      texture.flipY       = false
      texture.magFilter   = magFilter
      texture.minFilter   = minFilter
      texture.mapping     = UVMapping
      texture.needsUpdate = true

      var mode = 'static' // @Will Temp! 

      this.material.customProgramCacheKey = function() {
        return webgl2Enabled ? "1" : "0"
      }

      this.material.onBeforeCompile = (shader) => {

        shader.uniforms.fillMap = { value: texture }

        shader.vertexShader =
            "varying vec4 vWorldPosition;\n" + shader.vertexShader

        shader.vertexShader = shader.vertexShader.replace(
            "#define STANDARD",
            calcVertStandard()
        )

        shader.vertexShader = shader.vertexShader.replace(
            "void main() {",
            calcVertMain()
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            "#define STANDARD",
            calcFragStandard()
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            "#define FLAT_SHADED",
            ""
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            "uniform vec3 diffuse;",
            calcDiffuse( color_1, color_2 )
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            "#include <alphamap_fragment>", 

            `
            /* Currently disabled, after client request for bunching yarns */

            /* glsl */

            // apply alpha to holes
            /*
            if(diffuseColor.r < 0.1 && diffuseColor.b < 0.1 && diffuseColor.g > 0.9)
            {
                // green
                //diffuseColor.r = 0.0352941176470588;
                //diffuseColor.g = 0.0392156862745098;
                //diffuseColor.b = 0.0274509803921568;

                // white
                diffuseColor.r = 0.9607843137254902;
                diffuseColor.g = 0.9529411764705882;
                diffuseColor.b = 0.8901960784313725;
            }
            */
            `
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            "vec4 diffuseColor = vec4( diffuse, opacity );",
            calcDiffuseColor(image, mode, webgl2Enabled ? "webGL2" : "webGL1")
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            "#include <normal_fragment_maps>",
            calcNormalFragmentMaps()
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            "#include <dithering_pars_fragment>",
            calcDitheringParsFrag()
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            "#include <dithering_fragment>",
            [
                "gl_FragColor.rgb = dithering( gl_FragColor.rgb );"

            ].join( "\n" )
        )

      }

      this.material.dithering = true;
      this.material.needsUpdate = true;

      // loader stuff
      var id      = 'visualizerReady'
      var value   = 1
      this.$store.commit('utils/update', {id, value})
      this.$store.dispatch('utils/updateLoadPercentage')

      console.log('done updating material!')

    },

    generateFillMap(image) {

      let canvas;
      let ctxt;

      if (this.$data.fillMap == null) {

          canvas = document.createElement("canvas")
          ctxt   = canvas.getContext("webgl")

          this.$data.fillMap = { canvas, ctxt }

      } else {

          canvas = this.$data.fillMap.canvas
          ctxt   = this.$data.fillMap.ctxt

      }

      canvas.id     = "fill_canvas"
      canvas.width  = image.naturalWidth
      canvas.height = image.naturalHeight

      this.setShadersForCtxt(ctxt, fillMapVert, fillMapFrag)

      var tex = ctxt.createTexture()
      ctxt.activeTexture(ctxt.TEXTURE0)

      ctxt.bindTexture(ctxt.TEXTURE_2D, tex)
      ctxt.texImage2D(ctxt.TEXTURE_2D, 0, ctxt.RGBA, ctxt.RGBA, ctxt.UNSIGNED_BYTE, image)

      ctxt.texParameteri(ctxt.TEXTURE_2D, ctxt.TEXTURE_WRAP_S, ctxt.CLAMP_TO_EDGE)
      ctxt.texParameteri(ctxt.TEXTURE_2D, ctxt.TEXTURE_WRAP_T, ctxt.CLAMP_TO_EDGE)
      ctxt.texParameteri(ctxt.TEXTURE_2D, ctxt.TEXTURE_MIN_FILTER, ctxt.NEAREST)
      ctxt.texParameteri(ctxt.TEXTURE_2D, ctxt.TEXTURE_MAG_FILTER, ctxt.NEAREST)

      ctxt.drawArrays(ctxt.TRIANGLES, 0, 6)

      return { canvas, ctxt }

    },

    convertHexToRGB(color) {

      var m = ("#" + color).match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i)

      return {
          r: parseInt(m[1], 16) / 255.0,
          g: parseInt(m[2], 16) / 255.0,
          b: parseInt(m[3], 16) / 255.0
      }

    },

    getWebgl2Compatibility() {

      let usingWebgl2
      const gl = document.createElement("canvas").getContext("webgl2")
      if (!gl) {
          if (typeof WebGL2RenderingContext !== "undefined") {
              usingWebgl2 = false
              gl.getExtension("WEBGL_lose_context").loseContext()
          } else {
              // // (disabled due to alert always firing on iPad)
              // alert("your browser has no WebGL2 support at all"); 
          }
      } else {
          usingWebgl2 = true
          gl.getExtension("WEBGL_lose_context").loseContext()
      }
      return usingWebgl2
      
    },

    setShadersForCtxt(ctxt, vsSrc, fsSrc) {

      ctxt.viewport(0, 0, ctxt.drawingBufferWidth, ctxt.drawingBufferHeight)
      ctxt.clearColor(1.0, 0.8, 0.1, 1.0)
      ctxt.clear(ctxt.COLOR_BUFFER_BIT)

      let vs = ctxt.createShader(ctxt.VERTEX_SHADER)
      let fs = ctxt.createShader(ctxt.FRAGMENT_SHADER)

      ctxt.shaderSource(vs, vsSrc)
      ctxt.shaderSource(fs, fsSrc)

      ctxt.compileShader(vs)
      ctxt.compileShader(fs)

      let program = ctxt.createProgram()
      ctxt.attachShader(program, vs)
      ctxt.attachShader(program, fs)
      ctxt.linkProgram(program)
      ctxt.useProgram(program)

      let vertexBuffer = ctxt.createBuffer()
      ctxt.bindBuffer(ctxt.ARRAY_BUFFER, vertexBuffer)

      let vertices = new Float32Array([
          -1, -1,
          -1, 1,
          1, 1,

          -1, -1,
          1, 1,
          1, -1,
      ])

      ctxt.bufferData(ctxt.ARRAY_BUFFER, vertices, ctxt.STATIC_DRAW)

      let positionLocation = ctxt.getAttribLocation(program, "position")

      ctxt.vertexAttribPointer(positionLocation, 2, ctxt.FLOAT, false, 0, 0)
      ctxt.enableVertexAttribArray(positionLocation)

      let texValues = []

      texValues.push(ctxt.getUniformLocation(program, "textureSamplerImage"))
      texValues.push(ctxt.getUniformLocation(program, "textureSamplerFill"))
      texValues.push(ctxt.getUniformLocation(program, "textureSamplerColor"))
      texValues.push(ctxt.getUniformLocation(program, "textureSamplerNormal"))

      return texValues

    }

  },

  created() {

    this.material.alphaTest = 0.5
    this.material.transparent = true

    this.material.needsUpdate = true
    this.material.side = DoubleSide

    this.material.envMapIntensity = 1

  }
}