<template>
    
    <v-stage
        id="canvas-compo"
        :config="configKonva"
        @mousedown="handleStageMouseDown"
        @touchstart="handleStageMouseDown"
        @dragend="handleDragEnd"
        ref="mainStage">

    <!-- The base image, as defined by codemap in asset -->
        
        <v-layer  >
            <v-image
                :config="baseConfig">
            </v-image>
        </v-layer>

    <!-- All the editable item in Konva -->
        
        <v-layer ref="editable" :config="editableConfig">
            <canvas-component
                v-bind:key="component.id"
                :config="component"
                v-for="component in components"
                @transformend="handleTransformEnd"
                v-on:vnode-mounted="onChildMount()"
            />
        </v-layer>

    <!-- The final overlay on the image, to ensure no 'bleeding' -->
        
        <v-layer>
            <v-image :config="safeConfig" ref="safeArea">
            </v-image>
        </v-layer>

    <!-- The transformer that allows transforms on the items in "editable"-->
        
        <v-layer>
            <v-transformer ref="transformer"/>
        </v-layer>

        <!-- there must be a better way to do this... -->
        <div style="display:none">
            {{reprocessCache}}
        </div>

    </v-stage>
</template>

<script>

// The main stage for Vue-Konva. 


    import CanvasComponent from "./CanvasComponent.vue";
    import { CONFIG } from "../../modules/Managers/ConfigManager";
    import { isDefined } from "../../helpers/helpers";
    import { CanvasProcessor } from '../../store/modules/Canvas/Interface/CanvasProcessor'

    const width     = CONFIG.getProductConfig().size;
    const height    = CONFIG.getProductConfig().size;

    export default ({

        name: 'CanvasStage',
        components : {
            CanvasComponent,
        },

        props: ['reprocessCache'],

        data() {

            return {

                reprocessCache: 0,
                totalMounted:0,

                layerConfig: {
                    width: width,
                    height: height,
                    x: 0,
                    y: 0,
                },

                baseConfig: {
                    x       : 0,
                    y       : 0,
                    width   : width,
                    height  : height,
                    name    : 'base-image',
                    listening: false,
                    zIndex  : 0,
                    
                },

                configKonva: {
                    width   : width,
                    height  : height,
                    activeId: '',
                },

                editableConfig: {
                    width: width,
                    height: height,
                    x: 0,
                    y: 0,
                    zIndex: 1,
                    clipX: 0,
                    clipY: 0,
                    clipWidth: 2048,
                    clipHeight: 2048,
                },

                safeConfig: {
                    x       : 0,
                    y       : 0,
                    width   : width,
                    height  : height,
                    name    : 'safe-area',
                    listening: false,
                    zIndex  : 2,
                },
                
                components: [],
                selectedShapeName: ''

            }

        },

        mounted () {

            // loader stuff
            this.$refs.transformer.getNode().useSingleNodeRotation(true)
            
        // register codemap as the base layer
            let codemap = this.$store.getters['assets/getAssets']('codemap')
            this.baseConfig.image = codemap

        // register safeArea as the final layer
            let safeArea =  this.$store.getters['assets/getAssets']('safeArea')
            this.safeConfig.image = safeArea
            
        // initalize canvas processor
            this.processor = new CanvasProcessor(codemap, safeArea)

            // EVENTS.on(EXPORT_BMP, function() {

            //     let editableCanvas = this.$refs.editable.getNode().toCanvas()
            //     this.$refs.editable.getNode().draw()
            //     var quantizedCanvasData = this.processor.quantizeCanvas(editableCanvas)
                
            //     var a  = document.createElement('a');
            //     a.href = quantizedCanvasData;
            //     a.download = 'export.png';
            //     a.click()

            // }.bind(this))

        },

        watch: {
            
            // when activeId is changed on vuex, add item to transformer
            activeId() {
                if (this.selectedShapeName) this.updateTransformer();
                
                //TEMP
                this.$refs.editable.getNode().draw()

            },

            reprocessCache: {
                
                handler:function (newItem) {
                    this.reprocessCanvas();
                },
                deep:true
                
            },

            totalMounted() {

                // loader stuff
                var id = 'konvaReady'
                var value = this.$data.totalMounted
                this.$store.commit('utils/update', {id, value})
                this.$store.dispatch('utils/updateLoadPercentage')

			}



        },

        computed: {

            // activate transformer on the canvas object when
            // id is activated on vuex store
            activeId() {
                this.selectedShapeName = this.$store.getters['canvas/getActiveId']();
                return this.selectedShapeName
            },

            reprocessCache() {
                console.log('reprocessing commencing...')
                this.$data.reprocessCache = this.$store.getters['utils/getInterface']('reprocess')
            }


        },

        methods: {

            onChildMount() {
				this.$data.totalMounted += 1
			},

            reprocessCanvas() {

                var allStates = this.$store.getters['canvas/getAll']()
                this.components = allStates

                // loader stuff
                var id = 'konvaTotal'   
                var value = this.$data.components.length
                this.$store.commit('utils/update', {id, value})

                let editableCanvas = this.$refs.editable.getNode().toCanvas()
                this.$refs.editable.getNode().draw()
                var quantizedCanvasData = this.processor.quantizeCanvas(editableCanvas)
                console.log("process color arrangement...")
                this.$store.dispatch('utils/updateCanvas', quantizedCanvasData)
                
            },

            // each time a drag ends, process the group "editable"
            // which contains all the customization items
            handleDragEnd(e) {

                if (e.target.constructor.name == 'Transformer') return

				this.$store.dispatch('utils/reprocess')
                var params = {}

                params.x = e.target.attrs.x
                params.y = e.target.attrs.y
                params.scaleX = e.target.attrs.scaleX
                params.scaleY = e.target.attrs.scaleY
                params.rotation = e.target.attrs.rotation

                var id = e.target.attrs.name
                this.$store.dispatch('canvas/inject', {id, params})
                
            },

            handleTransformEnd(e) {
                var params = {}

                params.x = e.target.attrs.x
                params.y = e.target.attrs.y
                params.scaleX = e.target.attrs.scaleX
                params.scaleY = e.target.attrs.scaleY
                params.rotation = e.target.attrs.rotation

                var id = e.target.attrs.name
                this.$store.dispatch('canvas/inject', {id, params})

            },

            // this is for transformer, to activate. Also changes
            // the active item to the selected object on the transformer
            handleStageMouseDown(e) {
                
                e.evt.cancelBubble = true;

                if (e.target === e.target.getStage()) {
                    this.selectedShapeName = '';
                    this.updateTransformer();
                    return;
                }

                // clicked on transformer - do nothing
                const clickedOnTransformer =
                    e.target.getParent().className === 'Transformer';
                if (clickedOnTransformer) {
                    return;
                }

                // find clicked rect by its name
                const name = e.target.name();
                this.selectedShapeName = name;
                this.$store.commit('canvas/setActiveId', name)

                this.updateTransformer();
                
            },
            
            updateTransformer(e) {
                // here we need to manually attach or detach Transformer node
                const transformerNode = this.$refs.transformer.getNode();
                const stage = transformerNode.getStage();
                const { selectedShapeName } = this;

                const selectedNode = stage.findOne('.' + selectedShapeName);

                // do nothing if selected node is marked as locked
                if (selectedNode.attrs.locked == true) {
                    transformerNode.nodes([]);
                    return
                }
                // do nothing if selected node is already attached
                if (selectedNode === transformerNode.node()) {
                    return;
                }

                if (selectedNode) {
                    // attach to another node
                    transformerNode.nodes([selectedNode]);
                } else {
                    // remove transformer
                    transformerNode.nodes([]);
                }

            },


            // this is to translate the parameters that come from 
            // vuex, mostly to handle ImageObject.js
            translateParameters(config) {

                var configKonva = config

                for (const key in config.params) {
                    
                    let params = config.params

                    switch(key) {

                        case 'fillPatternImage':
                        case 'image':

                            if (isDefined(params[key].processedImage)) {
                                configKonva.params[key] = params[key].processedImage
                            }
                            break

                        default:
                            configKonva.params[key] = params[key]
                            break

                    }

                }

                return configKonva

            },



        },

    })
</script>

<style>

</style>
