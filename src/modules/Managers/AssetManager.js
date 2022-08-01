/*

This module is used to load all relevant assets prior to any other code being executed

*/

import { getFileName, isPathAbsolute } from '../../helpers/helpers'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import { CONFIG } from './ConfigManager'

import * as THREE from 'three'
import { store } from '../../store'

// PRODUCT
// STRUCTURES
// CUSTOMIZATION

export class AssetManager {


    constructor() {

        this.queue  = []
        this.assets = {}
        this.parseAssets()

    }


    async preload(_BASE_ASSET_URL) {

        const scope = this;

        for(let i=0;i<this.queue.length;i++){

            let item    = this.queue[i]
            let url     = item[0]
            let name    = item[1]
            let type    = item[2]

            if (!(name in scope.assets)) {

                if (type == 'image') {

                    console.log('... loading', url)
    
                    await this.loadImage(url).then((loadedItem)=>{
                        scope.assets[name] = loadedItem;
                    })
                    .catch((err)=>{
                        console.warn('image not loaded', err);
                    });
    
                } else if (type == '3d') {
    
                    await this.loadGlb(url).then((loadedItem)=>{
                        scope.assets[name] = loadedItem.scene;
                    })
                    .catch((err)=>{
                        console.warn('GLB not loaded', err);
                    });
    
                } else if (type == 'hdr') {
    
                    var loader = new RGBELoader()
                    loader.crossOrigin = '';
                    var urlNew = this.verifyUrl(url)
                    
                    loader.setDataType(THREE.HalfFloatType)
                        .load( urlNew, function ( loadedItem ) {

                            scope.assets[name] = loadedItem
    
                        })
    
                } else {
    
                    console.warn('unrecognized loader type!')
    
                }

            }

            var id = 'assetsReady'
            var value = i + 1
            store.commit('utils/update', {id, value})
            store.dispatch('utils/updateLoadPercentage')


        }

        return new Promise((resolve, reject) => {resolve()})

    }


    parseAssets() {

        let _SCENE = CONFIG.scene
        let _PRODUCT = CONFIG.product
        let _STRUCTURES = CONFIG.structures
        let _CUSTOMIZATION = CONFIG.customization
        
        // add any scene related asset
        if (_SCENE.hdr) {
            const hdriUrl = _SCENE.hdr
            this.addToQueue(hdriUrl, 'hdr', 'hdr')
        }

        // add 3d model to queue
        const modelUrl = _PRODUCT.model
        this.addToQueue(modelUrl, 'model', '3d')

        // add codemap to queue
        const codemapUrl = _PRODUCT.codemap
        this.addToQueue(codemapUrl, 'codemap', 'image')

        const safeAreaUrl = _PRODUCT.safeArea
        this.addToQueue(safeAreaUrl, 'safeArea', 'image')

        // for every parameter in STRUCTURES, check for normalMap and colorMap
        _STRUCTURES.forEach(e => {
            
            if ('normalMap' in e && e.normalMap) {
                var name = getFileName(e.normalMap)
                name in this.queue? null : this.addToQueue(e.normalMap, name, 'image')
            }

            if ('colorMap' in e && e.colorMap) {
                var name = getFileName(e.colorMap)
                name in this.queue? null : this.addToQueue(e.colorMap, name, 'image')
            }

            if ('fillMap' in e && e.fillMap) {
                var name = getFileName(e.fillMap)
                name in this.queue? null : this.addToQueue(e.fillMap, name, 'image')
            }

            if ('preview' in e && e.preview) {
                var name = getFileName(e.preview)
                name in this.queue? null : this.addToQueue(e.preview, name, 'image')
            }

        });

        // for every parameter in CUSTOMIZATION, check for clipMask
        _CUSTOMIZATION.canvas.forEach(e => {

            if ('image' in e.params && e.params.image) {
                // changed to e.params.image.url due to new config format
                var name = getFileName(e.params.image.url)
                name in this.queue? null : this.addToQueue(e.params.image.url, name, 'image' )
            }

            if ('fillPatternImage' in e.params && e.params.fillPatternImage) {
                // changed to e.params.image.url due to new config format
                var name = getFileName(e.params.fillPatternImage.url)
                name in this.queue? null : this.addToQueue(e.params.fillPatternImage.url, name, 'image' )
            }
            
        });

        // add to vuex store for loading manager
        var id = 'assetsTotal'
        var value = this.queue.length
        store.commit('utils/update', {id, value})


    }


    // add item to the preloader to be loaded
    addToQueue(itemUrl, name, type) {
        this.queue.push([itemUrl, name, type])
    }


    // handler to load '.png'
    async loadImage(_url) {

        var url = this.verifyUrl(_url)

        return new Promise((resolve, reject)=>{
        
            const img = new Image();
            img.onload = ()=>{
                resolve(img);
            }
            img.onerror = reject
            img.src = url; 
            img.setAttribute('crossOrigin', '');

        })

    
    }


    // handler to load '.glb'
    async loadGlb(_url) {

        var url = this.verifyUrl(_url)

        return new Promise((resolve, reject) => {

            const loader = new GLTFLoader();
            loader.crossOrigin = '';

            loader.load(url, (gltf) => {
            
                    resolve(gltf);

                }, (progressEvent) => {

                    if (progressEvent.lengthComputable) {
                        // TODO - total load minus already loaded
                        // this.progressBar.update(progressEvent.loaded, progressEvent.total);
                    }
                    
                }, (err) => {

                    console.warn('Cannot load 3D model from', url, '. Please check url source!');
                    reject()

                });
            }
        )

    }

    verifyUrl(_url) {

        var url = ''

        if (isPathAbsolute(_url)) {

            url = _url

        } else {

            url = CONFIG.baseAssetUrl + _url
            
        }

        return url

    }

    // async loadAsset(_url) {

    //     var url = ''

    //     if (isPathAbsolute(_url)) {

    //         url = _url

    //     } else {
            
    //         url = new URL(BASE_ASSET_URL + _url, document.baseURI).href
            
    //     }

    //     return new Promise(function(resolve, reject) {
    
    //         var xhttp = new XMLHttpRequest();
            
    //         console.log(url)

    //         xhttp.onreadystatechange = function() {
        
    //             if (this.readyState == 4 && this.status == 200)
        
    //             {
    
    //                 resolve (xhttp.response)
    
    //             }
        
    //             else if (xhttp.readyState === 4 && xhttp.status !== 200)
        
    //             {

    //                 defaultOnFail(xhttp.status, xhttp.statusText);
    //                 reject(xhttp.response)
    //             }
                
    //         };
        
    //         xhttp.open("GET", url, true);
    //         xhttp.send();
    
    //     })
    
    // }
    
    defaultOnFail (status, statusText) {
        console.warn('AJAX call failed!');
        console.warn('Status: ' + status + ' (' + statusText + ')');
    };

    
}

