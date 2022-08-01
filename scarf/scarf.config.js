
// all of the available yarn colors, as well as the feeder number
const ALL_YARN_COLORS = [

    {
        color   : "090A07",
        name    : "Black Swan",
        value   : "black",
        feeder  : 1
    },

    {
        color   : "F5F3E3",
        name    : "White Cotton",
        value   : "white",
        feeder  : 2
    },

    {
        color   : "35469D",
        name    : "Marina Blue",
        value   : "blue",
        feeder  : 3
    },

    {
        color   : "9F7d5E",
        name    : "Classic Camel",
        value   : "camel",
        feeder  : 4
    },

    {
        color   : "DF6536",
        name    : "Orange",
        value   : "orange",
        feeder  : 5
    },

    {
        color   : "737474",
        name    : "Fine Flannel",
        value   : "flannel",
        feeder  : 6
    },

    {
        color   : "9F1C28",
        name    : "Red Hot",
        value   : "red",
        feeder  : 7
    },

    {
        color   : "173321",
        name    : "Pine Forest",
        value   : "green",
        feeder  : 8
    },

]

const ALL_FONT_FAMILY = [

    'Georgia',
    'Palatino Linotype',
    'Times New Roman',
    'Arial',
    'Helvetica',
    'Lucida Sans Unicode',
    'Tahoma',
    'Verdana',
    'Courier New',
    'Lucida Console',

]

const ALL_FONT_STYLES = [

    'normal',
    'italic',
    'bold',
    'italic bold'

]

const COLOR_DISTANCE_FORMULAS = [

    'cie94-textiles'
    ,'cie94-graphic-arts'
    ,'ciede2000'
    ,'color-metric'
    ,'euclidean'
    ,'euclidean-bt709-noalpha'
    ,'euclidean-bt709'
    ,'manhattan'
    ,'manhattan-bt709'
    ,'manhattan-nommyde'
    ,'pngquant'

]

const PALETTE_QUANTIZATIONS = [

    'neuquant'
    ,'neuquant-float'
    ,'rgbquant'
    ,'wuquant'

]

const IMAGE_QUANTIZATIONS = [
    'nearest'
    ,'riemersma'
    ,'floyd-steinberg'
    ,'false-floyd-steinberg'
    ,'stucki'
    ,'atkinson'
    ,'jarvis'
    ,'burkes'
    ,'sierra'
    ,'two-sierra'
    ,'sierra-lite'

]

// yarn structures as defined by the CA
const ALL_STRUCTURES = [

    {
        name        : 'jacquard color 1',
        id          : 'jacquard_1',
        preview     : '../assets/structures/jacquard_1.png',
        // value       : 'ff00ff',
        value: 'EEEE00',
        programColor: 'EEEE00',

    },

    {
        name        : 'birdseye jacquard',
        id          : 'birdseye_jacquard',
        preview     : '../assets/structures/birdseye_jacquard.png',
        // value       : '00ffff',
        value: 'b3ccc7',
        programColor: 'b3ccc7',
    },

    {
        name        : 'jacquard color 2',
        id          : 'jacquard_2',
        preview     : '../assets/structures/jacquard_2.png',
        // value       : 'ffff00',
        value: '7a7b85',
        programColor: '7a7b85',
    },



    {
        id          : 'none',
        name        : 'none',
    }


]

// TODO: make a handler for when it's not localhost
// change Base_asset_url to wherever the file is hosted

BASE_ASSET_URL  = '../assets/'


// HTML configuration for the customizer itself
const VERSION   = { 
    // TODO:
    // either declare as b2b, b2c, or offline tools
}

const WEBSITE   = {

    containerId         : "variant-customizer-container",
    customizeButton     : "initialize-3d-customization"

}

// THREE.js visualization configuration
const SCENE     = {

    hdr     : 'scene/studio3_hdri.hdr',
    camera  : {

    }

}

// the product itself
const PRODUCT = {

    model       : '3d_models/Scarf.glb',
    codemap     : 'codemaps/Scarf_baseRef.png',
    safeArea    : 'codemaps/Scarf_safeArea.png',
    size        : 2048,                 // PoT size of codemap (512, 1024, or 2048)
    id          : 'Scarf'   // ID of the product, will be used to cache on browser

}


const CUSTOMIZATION = {

    yarns: [
        {
            type    : 'yarn',
            id      : 'yarn_1',
    
            params : {
                options : ALL_YARN_COLORS,
                value   : 'green',
                unique  : true,
                label   : 'Yarn 1'
            },
        
        },
    
        {
            type    : 'yarn',
            id      : 'yarn_2',
    
            params : {
                options : ALL_YARN_COLORS,
                value   : 'camel',
                unique  : true,
                label   : 'Yarn 2'
            },
    
        },
    ],

    canvas: [
        

    ],

}

const BLOCK_ICONS = [
    {
        type: 'colors',
        icon: '/icons/colors.png'
    },

    {
        type: 'images',
        icon: '/icons/image.png'
    }
]
