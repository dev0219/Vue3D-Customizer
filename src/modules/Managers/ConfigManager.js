/*

A simple mediator for config
@will TODO: change global var to config value ported from backend

*/

import { isDefined } from "../../helpers/helpers"
import * as dc from "../../default.config"

const BASE_ASSET_URL = './assets/' // sticking to public for static assets

class ConfigManager {

    constructor() {

        this.baseAssetUrl = BASE_ASSET_URL
        
        if (isDefined(dc.ALL_STRUCTURES)) {            
            this.structures = dc.ALL_STRUCTURES
        } else {
            console.warn('CONFIG ERROR: "STRUCTURES" variable not defined!')
        }

        if (isDefined(dc.ALL_YARN_COLORS)) {
            this.allColors = dc.ALL_YARN_COLORS
        } else {
            console.warn('CONFIG ERROR: "ALL_YARN_COLORS" variable not defined!')
        }

        if (isDefined(dc.VERSION)) {
            this.version = dc.VERSION
        } else {
            console.warn('CONFIG ERROR: "VERSION" variable not defined!')
        }

        if (isDefined(dc.WEBSITE)) {
            this.website = dc.WEBSITE
        } else {
            console.warn('CONFIG ERROR: "WEBSITE" variable not defined!')
        }

        if (isDefined(dc.SCENE)) {
            this.scene = dc.SCENE
        } else {
            console.warn('CONFIG ERROR: "SCENE" variable not defined!')
        }

        if (isDefined(dc.PRODUCT)) {
            this.product = dc.PRODUCT
        } else {
            console.warn('CONFIG ERROR: "PRODUCT" variable not defined!')
        }

        if (isDefined(dc.ALL_FONT_FAMILY)) {
            this.allFontFamily = dc.ALL_FONT_FAMILY
        } else {
            console.warn('CONFIG ERROR: "PRODUCT" variable not defined!')
        }

        if (isDefined(dc.ALL_FONT_STYLES)) {
            this.allFontStyles = dc.ALL_FONT_STYLES
        } else {
            console.warn('CONFIG ERROR: "PRODUCT" variable not defined!')
        }


        if (isDefined(dc.CUSTOMIZATION)) {
            
            // console.log("CUSTOMIZATION PARAMS :: ", CUSTOMIZATION)
            this.customization = dc.CUSTOMIZATION

            // query params can override default customization
            const keysValues = window.location.search
            const urlParams  = new URLSearchParams(keysValues)
            
            // if there is query translator for urlParams
            if (isDefined(dc.QUERY_TRANSLATOR)) {

                for (const key in dc.QUERY_TRANSLATOR) {

                    const urlValue  = urlParams.get(key)

                    if (isDefined(urlValue)) {

                        dc.QUERY_TRANSLATOR[key].forEach(object => {

                            var type = object.type
                            var key = object.key
                            var id = object.id
                            console.log(type,key,id)
                            var translate = object.translate
                            var value;

                            // if we have to translate the parameter to something else
                            if (isDefined(translate)) {
                                value = translate[urlValue]
                            } else {
                                value = urlValue
                            }

                            let targetObject = this.customization[type].find(x => x.id === id);
                            
                            if (key.length > 1) {
                                targetObject.params[key[0]][key[1]] = value
                            } else {
                                targetObject.params[key[0]] = value
                            }

                        });

                    }

                }

            }
        
        } else {
            console.warn('CONFIG ERROR: "CUSTOMIZATION" variable not defined!')
        }

        if (isDefined(dc.COLOR_DISTANCE_FORMULAS)) {
            this.cdf = dc.COLOR_DISTANCE_FORMULAS
        } else {
            console.warn('CONFIG ERROR: "COLOR_DISTANCE_FORMULAS" variable not defined!')
        }

        if (isDefined(dc.IMAGE_QUANTIZATIONS)) {
            this.iq = dc.IMAGE_QUANTIZATIONS
        } else {
            console.warn('CONFIG ERROR: "IMAGE_QUANTIZATIONS" variable not defined!')
        }

        if (isDefined(dc.PALETTE_QUANTIZATIONS)) {
            this.pq = dc.PALETTE_QUANTIZATIONS
        } else {
            console.warn('CONFIG ERROR: "PALETTE_QUANTIZATIONS" variable not defined!')
        }


    }


    getAllColors() {
        return this.allColors
    }
    getAllFontFamily() {
        return this.allFontFamily
    }
    getAllFontStyles() {
        return this.allFontStyles
    }

    getWebsiteConfig() {
        return this.website
    }
    getSceneConfig() {
        return this.scene
    }
    getProductConfig() {
        return this.product
    }
    getStructuresConfig() {
        return this.structures
    }
    getCustomizationConfig() {
        return this.customization
    }
    getUIConfig() {
        return this.uiConfig
    }

    getCDF() {
        return this.cdf
    }
    getIQ() {
        return this.iq
    }
    getPQ() {
        return this.pq
    }



}


const CONFIG = new ConfigManager()

export { CONFIG }