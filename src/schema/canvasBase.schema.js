import { CONFIG } from "../modules/Managers/ConfigManager"

// This is the base schema for items. Rect, Circle, Text, and Image
// all uses this on the editor side.

export const canvasItemBase = [

    {

        type        : 'block',
        params      : {
            label       : 'Position',
            className   : ['default-block', 'position'],
            collapsible : false
        },
        children    : [

            {
                type        : 'number',
                params      : {
                    label       : 'X',
                    route       : [{ key : ['x'] }]        
                }
            },
        
            {
                type        : 'number',
                params      : {
                    label       : 'Y',
                    route       : [{ key : ['y'] }]
                }
            },

        ]
    },

    {
        type        : 'number',
        params      : {
            label       : 'Rotation',
            min         : 0,
            max         : 360,
            className   : ['rotation'],
            route       : [{ key : ['rotation'] }]
        }
    },

    {

        type        : 'block',
        params      : {
            label       : 'Scale',
            className   : ['default-block', 'scale'],
            collapsible : false
        },
        children    : [

            {
                type        : 'number',
                params      : {
                    label       : 'X',
                    route       : [{ key : ['scaleX'] }]
                }
            },
        
            {
                type        : 'number',
                params      : {
                    label       : 'Y',
                    route       : [{ key : ['scaleY'] }]
                }
            },

        ]
    },

    {

        type        : 'block',
        params      : {
            label       : 'Skew',
            className   : ['default-block', 'skew', 'spaced-bottom'],
            collapsible : false
        },
        children    : [
            {
                type        : 'number',
                params      : {
                    label       : 'X',
                    route       : [{ key : ['skewX'] }]
                }
            },
        
            {
                type        : 'number',
                params      : {
                    label       : 'Y',
                    route       : [{ key : ['skewY'] }]
                }
            },

        ]
    },

    {

        type        : 'selector',
        params      : {
            label       : 'Stroke',
            options     : CONFIG.getStructuresConfig(),
            className   : ['default-block', 'stroke'],
            route       : [{ key: ['stroke'] }]
        },
    },

    {

        type        : 'number',
        params      : {
            label       : 'Stroke Width',
            className   : ['default-block', 'stroke', 'spaced-bottom'],
            route       : [{ key: ['strokeWidth'] }]
        },
    },

] 

export const fillBase = [

    {

        type        : 'selector',
        params      : {
            label       : 'Fill Type',
            options     : ['color', 'pattern'],
            route       : [{ key: ['fillPriority'] }]
        },

    },

    {

        type        : 'selector',
        params      : {
            label       : 'Fill',
            options     : CONFIG.getStructuresConfig(),
            className   : ['default-block', 'fill'],
            dependency  : { fillPriority : 'color'},
            route       : [{ key: ['fill'] }]
        },

    },

    {
        type        : 'number',
        params      : {
            label       : 'scale X',
            min         : 0,
            max         : 10,
            dependency  : { fillPriority : 'pattern'},
            route       : [{ key : ['fillPatternScaleX'] }]
        }
    },

    {
        type        : 'number',
        params      : {
            label       : 'scale Y',
            min         : 0,
            max         : 10,
            dependency  : { fillPriority : 'pattern'},
            route       : [{ key : ['fillPatternScaleY'] }]
        }
    },

    {

        type        : 'image-setup',
        params      : {
            dependency  : { fillPriority : 'pattern'},
            route       : [{ key: ['fillPatternImage'] }]
        },

    },


    // {
    //     type        : 'block',
    //     params      : {
    //         label       : 'Fill Pattern',
    //         className   : ['default-block', 'fill-pattern'],
    //         dependency  : { fillPriority : 'pattern'},
    //         route       : [{}],
    //         collapsible : false
    //     },
    //     children: [

    //         {
    //             type        : 'file',
    //             params      : {
    //                 label       : 'File',
    //                 route       : [{ key : ['fillPatternImage', 'originalImage']}]
    //             }
    //         },

    //         {
    //             type        : 'image',
    //             params      : {
    //                 label       : 'Image',
    //                 route       : [{ key : ['fillPatternImage', 'resizedImage']}]
    //             }
    //         },

    //         {
    //             type        : 'image',
    //             params      : {
    //                 label       : 'Paletted',
    //                 route       : [{ key : ['fillPatternImage', 'palettedImage']}]
    //             }
    //         },

    //         {
    //             type        : 'image',
    //             params      : {
    //                 label       : 'Processed',
    //                 route       : [{ key : ['fillPatternImage', 'processedImage']}]
    //             }
    //         },

    //         {
    //             type        : 'palette',
    //             params      : {
    //                 label       : 'Palette',
    //                 route       : [{ key : ['fillPatternImage', 'palette']}]
    //             }
    //         },

    //         // {
    //         //     type        : 'number',
    //         //     params      : {
    //         //         label       : 'Rotation',
    //         //         route       : [{ key : ['fillPatternRotation']}]
    //         //     }
    //         // },

    //         {
    //             type        : 'block',
    //             params      : {
    //                 label       : 'Scale',
    //                 className   : ['fill-pattern-scale'],
    //                 collapsible : false
    //             },
    //             children    : [
                    
    //                 {
    //                     type        : 'number',
    //                     params      : {
    //                         label       : 'X',
    //                         route       : [{key : ['fillPatternScaleX']}]
    //                     }
    //                 },
                
    //                 {
    //                     type        : 'number',
    //                     params      : {
    //                         label       : 'Y',
    //                         route       : [{key : ['fillPatternScaleY']}]
    //                     }
    //                 },
        
    //             ]
    //         }
    //     ],
    // },

]