// Image object is an interface for processing Images
// used in vuex for the parameters image and fillPatternImage.
// will eventually be used for fillGradient too

import { checkIfFileExists, convertStructureToHex, hexToRgbA, isPathAbsolute } from "../../../../helpers/helpers";
import { CONFIG } from "../../../../modules/Managers/ConfigManager";
import { ImageProcessor_v2 } from "./ImageProcessor_v2";

class ImageObject {

    constructor() {

        this.imageProcessor = new ImageProcessor_v2()
        // settings for processing
        this.colorDistanceFormula   = 'euclidean';
        this.paletteQuantization    = 'rgbquant';
        this.imageQuantization      = 'atkinson';
        this.colors                 = 3;

        // resizing
        this.maxSize                = 512;

        // the processedImage
        this.url;
        this.originalImage;
        this.resizedImage;
        this.palettedImage;
        this.processedImage;

        this.palette = []

        // @Will TODO: create handler for palette of image
        // and how that will be routed to UI and such
        this.structures = []

        // to keep track if any attribute changes, and which
        // function to call to complete the process
        // this will be passed on to UI and such
        this.cache = {};

    }

    async updateState(imageConfig) {

        console.log('\t\tupdating image obj')

        var legalParams = [
            'colorDistanceFormula',
            'colors',
            'imageQuantization',
            'paletteQuantization',
            'maxSize',
            'url',
            'originalImage',
            'palette',
            'structures',
            'refresh'
        ]

        var processImageFromScratch = true
        var reprocessWithNewParam = true

        for (const key in imageConfig) {

            if (legalParams.includes(key)) {

                switch (key) {

                    case 'refresh':
                        reprocessWithNewParam = true
                        processImageFromScratch = false
                        break
                        
                    case 'url':

                        // this.palette = []
                        await new Promise(async (resolve, reject) => {
                            this.handleNewUrl(key, imageConfig[key]).then(()=> {
                                console.log('\tnew image loaded from', imageConfig[key])
                                resolve()
                            })
                        })

                        break
                    
                    case 'originalImage':

                        // this.palette = []
                        await new Promise(async (resolve, reject) => {
                            this.handleNewImage(key, imageConfig[key]).then(()=> {
                                console.log('\tnew image loaded')
                                resolve()
                            })
                        })
                        break

                    case 'palette':
                        processImageFromScratch = false
                        reprocessWithNewParam = false
                        this.handleNewPalette(key, imageConfig[key])
                        break

                    case 'structures':
                        // console.log('asdf')
                        processImageFromScratch = false
                        reprocessWithNewParam = true
                        this.handleNewStructures(key, imageConfig[key])
                        break
                    
                    case 'colorDistanceFormula':
                    case 'imageQuantization':
                    case 'paletteQuantization':
                    case 'colors':
                    case 'maxSize':
                        this[key] = imageConfig[key]
                        break
                    
                    default:
                        break

                }


            } else {

                console.warn('key is not legal for image object!!', this.id, key)

            }

        }

        // @will : this is to create a differentiation of what to do
        // since some changes necessitates a whole image processing
        // to be performed, and another just requires to convert to
        // structure

        // if (Object.keys(imageConfig).length == 1 && 'structures' in imageConfig) {
        //     // this is in the case that only structures is changed.
        //     // No need to re-process image, just convert the already available image to color arrangements
        //     await this.processImageToColorArrangement();

        // } else {

        //     // otherwise, process wholesale
        //     await this.processImage();
        //     await this.processImageToColorArrangement();
        // }
        // if (processImageFromScratch) {

        //     await this.processImage();
        //     await this.processImageToColorArrangement();

        // }
        
        // if (reprocessWithNewParam) {
        //     console.log('reprocessing!!!!!!!!')
        //     await this.applyPaletteToImage();

        // }

        // await this.processImage();
        // await this.processImageToColorArrangement();


        if (processImageFromScratch) {

            await this.processImage();

        } else if (reprocessWithNewParam) {

            await this.applyPaletteToImage();
        
        }

        if (reprocessWithNewParam) {
            await this.processImageToColorArrangement();
        }

        return new Promise((resolve, reject) => {
            resolve()
        })

    }

    async applyPaletteToImage() {

        var config = {

            colorDistanceFormula    : this.colorDistanceFormula,
            paletteQuantization     : this.paletteQuantization,
            imageQuantization       : this.imageQuantization,
            colors                  : this.colors,
            palette                 : this.palette

        }

        var newImageData = await this.imageProcessor.applyPaletteToImage(this.resizedImage, this.palette, config)

        var canvas  = document.createElement('canvas');
        canvas.width    = this.resizedImage.width;
        canvas.height   = this.resizedImage.height;
        var context = canvas.getContext('2d');
        context.imageSmoothingEnabled = false

        var imageData = new ImageData(canvas.width, canvas.height)
        imageData.data.set(new Uint8ClampedArray(newImageData))
        context.putImageData(imageData, 0, 0)

        var palettedImageSrc = canvas.toDataURL()

        return new Promise((resolve, reject) => {

            var palettedImage = new Image()
            palettedImage.width = this.resizedImage.width
            palettedImage.height = this.resizedImage.height

            palettedImage.onload = function() {
                
                this.palettedImage  = palettedImage;
                

                resolve()

            }.bind(this)

            palettedImage.src = palettedImageSrc

        })

    }

    handleNewPalette(key, value) {

        var index = value.active
        var newPalette = this.imageProcessor.buildPalettePoint(value)

        this.palette[index] = newPalette
        console.log('xxxxx', newPalette)
    
    }

    handleNewStructures(key, value) {

        var index = value.active
        this.structures[index] = value.value
        console.log('yyyyy', this.structures)
        
    }

    async handleNewUrl(key, value) {

        var scope = this;

        return new Promise(async (resolve, reject) => {


            var validatedUrl = this.verifyUrl(value)
            // check if file actually exists
            await checkIfFileExists(validatedUrl)
            .then((fileExists) => {

                if (fileExists) {

                    var request = new XMLHttpRequest();
                    var image = new Image()
                    image.setAttribute('crossOrigin', '');

                    request.onload = function () {

                        if (request.status === 200) {
                            var response = request.response;
                            var urlCreator = window.URL || window.webkitURL;
                            var imageUrl = urlCreator.createObjectURL(response);

                            image.onload = function() {
                                scope.originalImage = image;
                                resolve()
                            }
                            image.src = imageUrl;

    
                        } else {
    
                            reject(new Error('Image didn\'t load successfully; error code:' + request.statusText, '\n', key, validatedUrl));
                        }
                    };
                  
                    request.onerror = function () {
                        reject(new Error('There was a network error.'));
                    };
    
                    request.open("GET", validatedUrl);
                    request.responseType = 'blob';
                    request.send();
    
                } else {
    
                    reject(new Error('The provided url is not a file: \n', key, validatedUrl))
    
                }

            })

        })

    }

    async handleNewImage(key, value) {

        return new Promise((resolve, reject) => {

            if (value instanceof HTMLImageElement) {
                console.log('handling as image')
                this.originalImage = value;
                resolve()
    
            } else if (value instanceof HTMLCanvasElement) {
                console.log('handling as canvas')
                this.originalImage = new Image()
                this.originalImage.onload = function() {
                    resolve()
                }
                this.originalImage.src = value.toDataURL()
    
            } else {

                console.warn('image is not of type Image or Canvas: \n', key, value)
                reject()

            }

        })

    }

    verifyUrl(_url) {

        var url = ''
        
        if (isPathAbsolute(_url)) {

            url = _url

        } else if (isPathAbsolute(CONFIG.baseAssetUrl)) {
            
            url = CONFIG.baseAssetUrl + _url

        } else {
            
            url = new URL(CONFIG.baseAssetUrl + _url, document.baseURI).href
            
        }

        return url

    }

    async processImage() {

        var resizedImage = await this.resizeImage(this.originalImage, this.maxSize)

        var config = {

            colorDistanceFormula    : this.colorDistanceFormula,
            paletteQuantization     : this.paletteQuantization,
            imageQuantization       : this.imageQuantization,
            colors                  : this.colors,
            palette                 : this.palette

        }

        var { newImageData, palette } = await this.imageProcessor.process(resizedImage, config)

        var canvas  = document.createElement('canvas');
        canvas.width    = resizedImage.width;
        canvas.height   = resizedImage.height;

        var context = canvas.getContext('2d');
        context.imageSmoothingEnabled = false

        var imageData = new ImageData(canvas.width, canvas.height)
        imageData.data.set(new Uint8ClampedArray(newImageData))
        context.putImageData(imageData, 0, 0)

        var palettedImageSrc = canvas.toDataURL()

        return new Promise((resolve, reject) => {

            var palettedImage = new Image()
            palettedImage.width = resizedImage.width
            palettedImage.height = resizedImage.height

            palettedImage.onload = function() {
                this.resizedImage   = resizedImage;
                this.palettedImage  = palettedImage;
                this.palette        = palette._pointArray;

                resolve()

            }.bind(this)

            palettedImage.src = palettedImageSrc

        })

    }

    generateDefaultStructures() {

        var allStructures = CONFIG.getStructuresConfig()
        var modulo = allStructures.length

        for (var i = 0; i < this.palette.length; i++) {
            this.structures.push(allStructures[i % modulo].id)
        }

    }

    async processImageToColorArrangement() {

        // if no structure
        if (this.structures.length == 0) {

            console.warn('no structure array defined yet, defaulting to default structure array')
            this.generateDefaultStructures()

        }

        // if length is not the same
        if (this.structures.length != this.palette.length) {
            let sl = this.structures.length
            let pl = this.palette.length

            // @will : TODO improvement, create a palette value detector
            // that allows structures to be mapped accurately onto
            // the new incoming palette
            if (sl < pl) {
                while (this.structures.length != this.palette.length) {
                    var allStructures = CONFIG.getStructuresConfig()
                    this.structures.push(allStructures[0].id)
                    if (sl == pl) break;
                }
            } else {
                while (this.structures.length != this.palette.length) {
                    this.structures.pop()
                    if (sl == pl) break;
                }
            }

        }

        var colorArrangements = []

        this.structures.forEach(structure => {

            if (structure === 'none') {

                colorArrangements.push([0,0,0,0])

            } else {

                var value = convertStructureToHex(structure)
                var rgbArray = hexToRgbA(value)
                rgbArray.push(255)
                colorArrangements.push(rgbArray)
                
            }

        });

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.imageSmoothingEnabled = false
        let img = this.palettedImage

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);

        var palettedImageData = context.getImageData(0, 0, img.width, img.height);

        var processedImageCanvas = this.imageProcessor.convertToColorArrangement(
            palettedImageData,
            this.palette,
            colorArrangements,
            img.width,
            img.height
            )
        
        var scope = this

        return new Promise((resolve, reject) => {
            var processedImage = new Image()
            processedImage.width = img.width
            processedImage.height = img.height
            var processedImageSrc = processedImageCanvas.toDataURL()
            processedImage.onload = function() {
                scope.processedImage = processedImage;
                resolve(processedImage)
            }
            processedImage.src = processedImageSrc
        })

    }

    async resizeImage(image, maxSize) {

        var canvas = document.createElement('canvas')
        var width = image.width
        var height = image.height;

        if (width > height) {
            if (width > maxSize) {
                console.log('\t\timage : resizing to maximum of ' + maxSize)
                height *= maxSize / width;
                width = maxSize;
            } else {
                return image
            }
        } else {
            if (height > maxSize) {
                console.log('\t\timage : resizing to maximum of ' + maxSize)
                width *= maxSize / height;
                height = maxSize;
            } else {
                return image
            }
        }

        canvas.width    = width;
        canvas.height   = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);

        var dataUrl = canvas.toDataURL();

        return new Promise((resolve, reject) => {

            var resizedImage    = new Image();
            resizedImage.width  = width;
            resizedImage.height = height;
            resizedImage.onload = async function() {
            
                resolve(resizedImage)
        
            }

            resizedImage.src = dataUrl
        })

    }

}

export {ImageObject}