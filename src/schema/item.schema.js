import { CONFIG } from "../modules/Managers/ConfigManager"
import { canvasItemBase, fillBase } from "./canvasBase.schema"

// This is a schema for how UI is displayed on the knit editor. on the
// key 'ui', there's an array that shows how it's configured on
// ItemDetail.vue. Most of these would extend canvasItemBase, with
// the exception of Group.

const itemSchema = {

    rect : {
        name: 'Rectangle',
        type: 'rect',
        ui: [
            {
                type        : 'number',
                params      : {
                    label       : 'Width',
                    route       : [{ key : ['width'] }]        
                }
            },

            {
                type        : 'number',
                params      : {
                    label       : 'Height',
                    className   : ['spaced-bottom'],
                    route       : [{ key : ['height'] }]        
                }
            },

            ...canvasItemBase,
            ...fillBase
        ]
    },

    circle : {
        name: 'Circle',
        type: 'circle',
        ui: [

            {
                type        : 'number',
                params      : {
                    label       : 'Radius',
                    className   : ['spaced-bottom'],
                    route       : [{ key : ['radius'] }]        
                }
            },
            ...canvasItemBase,
            ...fillBase,
        ]
    },

    text : {
        name: 'Text',
        type: 'text',
        ui: [

            {
                type        : 'text',
                params      : {
                    label       : 'Text',
                    route       : [{ key : ['text'] }]        
                }
            },

            {
                type        : 'selector',
                params      : {
                    label       : 'Font',
                    options     : CONFIG.getAllFontFamily(),
                    route       : [{ key : ['fontFamily'] }]        
                }
            },

            {
                type        : 'selector',
                params      : {
                    label       : 'Style',
                    options     : CONFIG.getAllFontStyles(),
                    route       : [{ key : ['fontStyle'] }]        
                }
            },

            {
                type        : 'number',
                params      : {
                    label       : 'Font Size',
                    className   : ['spaced-bottom'],
                    route       : [{ key : ['fontSize'] }]        
                }
            },

            ...canvasItemBase,
            ...fillBase
        ]
    },

    image : {
        name: 'Image',
        type: 'image',
        ui: [
            ...canvasItemBase,

            {

                type        : 'image-setup',
                params      : {
                    className   : ['default-block', 'fill'],
                    route       : [{ key: ['image'] }]
                },
        
            },
 
        ]
    }
                                           
}

export { itemSchema }