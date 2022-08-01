export const QUERY_TRANSLATOR = {

    yarn1 : [
        {
            type: 'yarns',
            id: 'yarn_1',
            key: ['value'],
        }
    ],

    yarn2 : [
        {
            type: 'yarns',
            id: 'yarn_2',
            key: ['value'],
        }
    ],

    text1: [
        {
            type: 'canvas',
            id: 'text_1',
            key: ['text'],
        }
    ],

    text2: [
        {
            type: 'canvas',
            id: 'text_2',
            key: ['text'],
        }
    ],

    design: [
        {
            type: 'canvas',
            id: 'image_1',
            key: ['image', 'url'],
            translate: {
                1: 'images/tiger.jpg',
                2: 'images/earth.jpg',
                3: 'images/psych.jpg'
            }
        }
    ]


}



// all of the available yarn colors, as well as the feeder number
export const ALL_YARN_COLORS = [

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

export const ALL_FONT_FAMILY = [

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

export const ALL_FONT_STYLES = [

    'normal',
    'italic',
    'bold',
    'italic bold'

]

export const COLOR_DISTANCE_FORMULAS = [

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

export const PALETTE_QUANTIZATIONS = [

    'neuquant'
    ,'neuquant-float'
    ,'rgbquant'
    ,'wuquant'

]

export const IMAGE_QUANTIZATIONS = [
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
export const ALL_STRUCTURES = [

    {
        name        : 'jacquard color 1',
        id          : 'jacquard_1',
        preview     : 'structures/jacquard_1.png',
        // value       : 'ff00ff',
        value: 'EEEE00',
        programColor: 'EEEE00',

    },

    {
        name        : 'birdseye jacquard',
        id          : 'birdseye_jacquard',
        preview     : 'structures/birdseye_jacquard.png',
        // value       : '00ffff',
        value: 'b3ccc7',
        programColor: 'b3ccc7',
    },

    {
        name        : 'jacquard color 2',
        id          : 'jacquard_2',
        preview     : 'structures/jacquard_2.png',
        // value       : 'ffff00',
        value: '7a7b85',
        programColor: '7a7b85',
    },



    {
        id          : 'none',
        name        : 'none',
    }


]

// HTML configuration for the customizer itself
export const VERSION   = { 
    // TODO:
    // either declare as b2b, b2c, or offline tools
}

export const WEBSITE   = {

    containerId         : "variant-customizer-container",
    customizeButton     : "initialize-3d-customization"

}

// THREE.js visualization configuration
export const SCENE     = {

    hdr     : 'scene/studio3_hdri.hdr',
    camera  : {

    }

}

// the product itself
export const PRODUCT = {

    model       : '3d_models/Ashley_myChair.glb',
    codemap     : 'codemaps/Ashley_myChair_baseRef.png',
    safeArea    : 'codemaps/Ashley_myChair_safeArea_v2.png',
    size        : 2048,                 // PoT size of codemap (512, 1024, or 2048)
    id          : 'Ashley_chair_v001'   // ID of the product, will be used to cache on browser

}


export const CUSTOMIZATION = {

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

        {
            type    : 'rect',
            name    : 'Base Pattern',
    
            params : {
    
                fillPatternImage    : {
                    url                     : 'images/variant.png',
                    colorDistanceFormula    : 'euclidean',
                    paletteQuantization     : 'rgbquant',
                    imageQuantization       : 'atkinson',
                    colors                  : 3,
                    maxSize                 : 256,                
                },

                fillPatternRotation : 0,
                fillPatternScaleX   : 1,
                fillPatternScaleY   : 1.75,
                fillPriority        : 'pattern',
                
                x           : 0,
                y           : 0,
                width       : 2048,
                height      : 2048,
                draggable   : false,

                locked      : true,
    
            }
    
        },
    
        {
            type    : 'image',
            id      : 'image_1',

            params : {

                image : {
                    url                     : 'images/clouds.jpg',
                    colorDistanceFormula    : 'euclidean',
                    paletteQuantization     : 'rgbquant',
                    imageQuantization       : 'atkinson',
                    colors                  : 3,
                    maxSize                 : 300,
                },

                rotation    : 180,
                x           : 650,
                y           : 800,
                scaleX      : 1,
                scaleY      : 1.75,
                draggable   : true
    
            }
    
        },
    
        {
            type    : 'image',
    
            params : {
    
                image : {
                    url         : 'images/cube.jpg',
                    colors      : 3,
                    maxSize     : 125,
                },
    
                x           : 460,
                y           : 1200,
                scaleX      : 1,
                scaleY      : 1.75,
                draggable   : true,


            }
    
        },
    
        {
            type    : 'circle',

            params : {
                fill        : 'birdseye_jacquard',
                x           : 525,
                y           : 550,
                radius      : 70,
                draggable   : true,
            }
    
        },
    
        {
            type    : 'text',
            id      : 'text_1',

            params : {
                text        : 'hello!',
                fontFamily  : 'Helvetica',
                fill        : 'jacquard_1',
                fontSize    : 50,
                x           : 620,          
                y           : 900,
                scaleX      : 1,
                scaleY      : 2,
                draggable   : true,
                align       : 'center',
                verticalAlign: 'middle',
                rotation    : 180,
    
                stroke      : 'jacquard_2',
                strokeWidth     : 1,
    
            }
    
        },
    
    
        {
            type    : 'text',
            id      : 'text_2',

            params : {
    
                text        : 'variant prototype',
                fontFamily  : 'Helvetica',
                fill        : 'jacquard_1',
                fontSize    : 30,
                x           : 420,          
                y           : 850,
                scaleX      : 1,
                scaleY      : 2,
                draggable   : true,
                align       : 'center',
                verticalAlign: 'middle',
    
                stroke          : 'jacquard_2',
                strokeWidth     : 1,
                
            }
    
            
        },

    ],


    ui : [

        // {
        //     type        : 'button',
        //     params      : {

        //         label       : 'Yarn 1',
        //         options     : ALL_YARN_COLORS,
        //         route       : [
        //             {
        //                 path    : ['yarns', 'yarn'],
        //                 key     : ['value']
        //                 // path : 'yarns/yarn/value
        //             }
        //         ]

        //     }

        // },

        // {
        //     type        : 'button',
        //     params      : {

        //         label       : 'Yarn 2',
        //         options     : ALL_YARN_COLORS,
        //         route       : [
        //             {
        //                 path    : ['yarns', 'yarn_2'],
        //                 key     : ['value']
        //             }
        //         ],


        //     }

        // },

        {
            type        : 'number',
            params      : {

                label       : 'Number for font size',
                route       : [
                    {
                        path    : ['canvas', 'text'],
                        key     : ['fontSize']
                    }
                ]

            }

        },

        {
            type        : 'selector',
            params      : {

                label       : 'CDF',
                options     : COLOR_DISTANCE_FORMULAS,
                route       : [
                    {
                        path    : ['canvas', 'image'],
                        key     : ['image', 'colorDistanceFormula']
                    }
                ]

            }

        },

        {
            type        : 'number',
            params      : {

                label       : 'Number for font size',
                route       : [
                    {
                        path    : ['canvas', 'text'],
                        key     : ['fontSize']
                    }
                ]

            }

        },

        {

            type        : 'block',
            params      : {

                label       : 'Block New',
                collapsible : false,

            },

            children    : [

                {
                    type        : 'button',
                    params      : {
        
                        label       : 'Yarn 1 - NESTED',
                        options     : ALL_YARN_COLORS,
                        route       : [
                            {
                                path    : ['yarns', 'yarn'],
                                key     : ['value']
                            }
                        ]
        
                    }
        
                },

                {
                    type        : 'slider',
                    params      : {
        
                        label       : 'Slider for font size',
                        route       : [
                            {
                                path    : ['canvas', 'text'],
                                key     : ['fontSize']
                            }
                        ]
        
                    }
        
                },

                {
                    type        : 'number',
                    params      : {
        
                        label       : 'Number for font size',
                        route       : [
                            {
                                path    : ['canvas', 'text'],
                                key     : ['fontSize']
                            }
                        ]
        
                    }
        
                },

                {
                    type        : 'number',
                    params      : {
        
                        label       : 'Number for font size',
                        route       : [
                            {
                                path    : ['canvas', 'text'],
                                key     : ['fontSize']
                            }
                        ]
        
                    }
        
                },

                {

                    type        : 'block',
                    params      : {
        
                        label       : 'Nested Block',
                        collapsible : false,
        
                    },
        
                    children    : [

                        {
                            type        : 'text',
                            params      : {
                
                                label       : 'TEXT INPUT',
                                route       : [
                                    {
                                        path    : ['canvas', 'text'],
                                        key     : ['text']
                                    }
                                ]
                
                            }
                
                        },

                        {

                            type        : 'image',
                            params      : {
                
                                label       : 'Processed Image',
                                route       : [
                                    {
                                        path    : ['canvas', 'image'],
                                        key     : ['image', 'processedImage']
                                    }
                                ]
                
                            }

                        },

                        {
                            type        : 'number',
                            params      : {
                
                                label       : 'Number of colors',
                                route       : [
                                    {
                                        path    : ['canvas', 'image'],
                                        key     : ['image', 'colors']
                                    }
                                ]
                
                            }
                
                        },

                        {

                            type        : 'image',
                            params      : {
                
                                label       : 'Paletted Image',
                                route       : [
                                    {
                                        path    : ['canvas', 'image'],
                                        key     : ['image', 'palettedImage']
                                    }
                                ]
                
                            }

                        },

                    ]
                }

            ],

        }

    ]

}