// Base class for all States
// all states will have this properties

export default class {
    
    constructor() {
        this.id     = null;
        this.type   = null;
        this.params = {}
            
    }

    async injectParameters(params) {

        var newParams = {};

        for (const key in params) {

            let value   = params[key]

            if (key in this.params) {

                var newParam = await this.handleParameter(key, value)
                for (const key in newParam) {
                    newParams[key] = newParam[key]
                }

            } else {

                console.warn('unrecognized parameter on', this.id + " :",
                '\n', key, value)

            }
            
        }

        return new Promise((resolve, reject) => {resolve(
            newParams
        )})

    }

    async handleParameter(key, value) {

        // @will TODO : handle ellipse's 'radius' with {x,y}
        // @will TODO : for organizational purpose, separate handling of
        // yarn, canvas, and UI parameters

        var newParam;
        switch( key ) {

            case 'x'            :
            case 'y'            :
            case 'width'        : 
            case 'height'       :
            case 'clipX'        :
            case 'clipY'        : 

            case 'rotation'     :
            case 'scale'        :
            case 'scaleX'       :
            case 'scaleY'       :
            case 'skewX'        :
            case 'skewY'        : 

            case 'strokeWidth'  :

            case 'radius'       :
            case 'sides'        :
            case 'cornerRadius' :

            case 'fontSize'     :

            case 'fillPatternRotation'  :
            case 'fillPatternScale'     :
            case 'fillPatternScaleX'    :
            case 'fillPatternScaleY'    :

                newParam = this.handleNumber(key, value)
                break

            case 'text'         :
            case 'fontFamily'   :
            case 'fontStyle'    :
            case 'fill'         : // value would be 'jacquard_1', 'birdseye_jacquard', etc...
            case 'stroke'       : // value would be 'jacquard_1', 'birdseye_jacquard', etc...
            case 'fillPriority' :

            case 'yarnId'       :
            case 'value'        :
            case 'label'        :

                newParam = this.handleString(key, value)
                break

            case 'fillPatternImage' :
            case 'image'            :
                await new Promise(async (resolve, reject) => {
                    newParam = await this.handleImage(key, value)
                    resolve()
                })
                break
            
            case 'options'          :
            case 'className'        :
            case 'layerPosition'    :
            case 'route'            :
                
                newParam = this.handleArray(key, value)
                break

            case 'draggable'        :
            case 'unique'           :
            case 'collapsible'      :
            case 'locked'           :

                newParam = this.handleBoolean(key, value)
                break

            default:
                break

        }

        return new Promise((resolve, reject) => {
            resolve(newParam)
        })

    }

    handleBoolean(key, value) {

        var newParam = {}

        if (typeof value == "boolean") {
            newParam[key] = value
        } else {
            console.warn('input is not of type boolean on', key, value)
        }

        return newParam;

    }

    handleNumber(key, value) {

        var newParam = {}

        if (typeof value == "number") {
            newParam[key] = value
        } else if (Number(value)) {
            newParam[key] = Number(value)
        } else if (value == '0') {
            newParam[key] = 0
        } else {
            console.warn('input is not of type number on', key, value)
        }

        return newParam;

    }

    handleString(key, value) {

        var newParam = {}

        if (typeof value == "string") {
            newParam[key] = value
        } else {
            console.warn('input is not of type string on', key, value)
        }

        return newParam;

    }

    async handleImage(key, value) {

        // value should be a JSON so that it assign property correctly
        // into ImageObject()
        if (
            typeof value === 'object' &&
            !Array.isArray(value) &&
            value !== null
        ) {

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
            var obj = {}

            // filtering out illegal keys
            for (const valueKey in value) {
                if (legalParams.includes(valueKey)) {
                    if (valueKey == 'colors') {
                        obj[valueKey] = Number(value[valueKey])
                    } else {
                        obj[valueKey] = value[valueKey]
                    }
                } else {
                    console.warn ('object key', valueKey, ' is illegal in', key)
                }
            }

            console.log('\tupdating with', obj)
            
            let newImageObj = this.params[key]
            await newImageObj.updateState(obj)
            var newParam = {}
            newParam[key] = newImageObj

            return new Promise((resolve, reject)=> {
                resolve(newParam)
            })

        } else {

            console.warn('input is not of type object on', key, value)
            return new Promise((resolve, reject)=> {
                reject()
            })
        }

    }

    handleArray(key, value) {

        var newParam = {}

        if (Array.isArray(value)) {
            newParam[key] = value
        } else {
            console.warn('input is not of type array on', key, value)
        }

        return newParam

    }

    getStructureColor(structureId) {

        if (structureId === 'none') {
            return '#00000000'
        }
        let structures = CONFIG.getStructuresConfig()
        var structure = structures.filter(obj => obj.id == structureId)[0]
        return structure.value

    }

    getAllPossibleStructures() {
        return structures = CONFIG.getStructuresConfig()
    }

}