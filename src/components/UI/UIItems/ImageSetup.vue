 
<template>
	<div :class="['ui-setup-image', 'ui-components', 'ui-modal'].concat(config.params.className)"
        style="display:block"
        v-if="checkDependency">

		<label-container :label="config.params.label"
            v-if="config.params.label">
        </label-container>

		<!-- <button
            class="fake-button"
			@click="showSetupModal=true"
		>
            Edit Image
        </button> -->
        <UploadButton :config="buttonConfig"/>

        <div class="image-viewer checkered-bg ui-components">
            <ImageContainer v-if="showingOriginal" :config="resizedConfig"/>
            <ImageContainer v-if="showingQuantized" :config="palettedConfig"/>
            <ImageContainer v-if="showingProcessed" :config="processedConfig"/>
        </div>

            

        <div class="tab-container">
            <button label="show-original-image"
                v-bind:class = "(showingOriginal)?'active':''"
                class='fake-tab'
                @click="showOriginal" >Original</button>
            <button label="show-quantized-image"
                v-bind:class = "(showingQuantized)?'active':''"
                class='fake-tab'
                @click="showQuantized">Quantized</button>
            <button label="show-processed-image"
                v-bind:class = "(showingProcessed)?'active':''"
                class='fake-tab'
                @click="showProcessed">Processed</button>
        </div>

        <div style="margin-bottom:15px">
        </div>
        <!-- </panZoom> -->
        
        

        <StructureSelector :config="structureConfig"/>
        <PaletteSelector :config="paletteConfig"/>

        <Selector :config="cdfConfig"/>
        <Selector :config="iqConfig"/>
        <Selector :config="pqConfig"/>

        <!-- <transition name="modal" v-if="showSetupModal">

            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container">

                        <div class="modal-header">
                            <h3> Image Setup {{checkChanges}} </h3>
                        </div>

                        <button class="modal-close-button" @click="showSetupModal=false">
                            X
                        </button>
                    
                    </div>            
                </div>
            </div>

        </transition> -->

        
	</div>


</template>

<script>

	import LabelContainer from "./LabelContainer.vue";
    
	import { onChange, getStateValue, checkDependency } from "../utils";
    import UploadButton from './UploadButton.vue';
    import ImageContainer from './ImageContainer.vue';
    import PaletteSelector from './PaletteSelector.vue';
    import StructureSelector from './StructureSelector.vue';
    import YarnSelector from '../Editor/YarnSelector.vue'

    import Selector from './Selector.vue'
    import { CONFIG } from '../../../modules/Managers/ConfigManager';
    import { ImgComparisonSlider } from '@img-comparison-slider/vue';
    
    import VueSelect from 'vue-select'
    import 'vue-select/dist/vue-select.css'
    
    // import panZoom from 'vue-panzoom'

	export default {

		name: 'ImageSetup',
		components: {
            LabelContainer,
            UploadButton,
            ImageContainer,
            PaletteSelector,
            StructureSelector,
            Selector,
            ImgComparisonSlider,
            YarnSelector,
            VueSelect
        },
		props: ['config'],

        data() {

            return {

                showSetupModal: false,

                showingOriginal: true,
                showingQuantized: false,
                showingProcessed: false,

            }

        },

		computed : {
			currentValue: getStateValue,
			checkDependency : checkDependency,

            buttonConfig() {
                return {                    
                    params: {
                        label:  'File',
                        route: [{
                            path: this.config.params.route[0].path,
                            key : [this.config.params.route[0].key[0], 'originalImage']
                        }]
                    }
                }
            },

            palettedConfig() { 
                return{
                    params: {
                        className:  ['setup-image'],
                        route: [{
                            path: this.config.params.route[0].path,
                            key : [this.config.params.route[0].key[0], 'palettedImage']
                        }]
                    }
                }
            },

            processedConfig() {
                return {
                    params: {
                        className:  ['setup-image'],
                        route: [{
                            path: this.config.params.route[0].path,
                            key : [this.config.params.route[0].key[0], 'processedImage']
                        }]
                    }
                }
            },

            cdfConfig() {
                return {
                    params: {
                        label: 'Color Distance Formula',
                        options: CONFIG.getCDF(),
                        route: [{
                            path: this.config.params.route[0].path,
                            key : [this.config.params.route[0].key[0], 'colorDistanceFormula']
                        }]
                    }
                }
            },

            iqConfig() {
                return {
                    params: {
                        label: 'Image Quantization method',
                        options: CONFIG.getIQ(),
                        route: [{
                            path: this.config.params.route[0].path,
                            key : [this.config.params.route[0].key[0], 'imageQuantization']
                        }]
                    }
                }
            },

            pqConfig() {
                return {
                    params: {
                        label: 'Palette Quantization method',
                        options: CONFIG.getPQ(),
                        route: [{
                            path: this.config.params.route[0].path,
                            key : [this.config.params.route[0].key[0], 'paletteQuantization']
                        }]
                    }
                }
            },

            structureConfig() {
                return {
                    params: {
                        label: 'Structure',
                        options: this.config,
                        route: [{
                            path: this.config.params.route[0].path,
                            key : [this.config.params.route[0].key[0], 'structures']
                        }]
                    }
                }
            },

            paletteConfig() {
                return {
                    params: {
                        label: 'Palette',
                        options: this.config,
                        route: [{
                            path: this.config.params.route[0].path,
                            key : [this.config.params.route[0].key[0], 'palette']
                        }]
                    }
                }
            },

            resizedConfig() {
                return {
                    params: {
                        className:  ['setup-image'],
                        route: [{
                            path: this.config.params.route[0].path,
                            key : [this.config.params.route[0].key[0], 'resizedImage']
                        }]
                    }
                }
            }


		},

		methods: {
			onChange : onChange,

            showOriginal() {
                this.showingOriginal = true
                this.showingQuantized = false
                this.showingProcessed = false
            },

            showQuantized() {
                this.showingOriginal = false
                this.showingQuantized = true
                this.showingProcessed = false
            },

            showProcessed() {
                this.showingOriginal = false
                this.showingQuantized = false
                this.showingProcessed = true
            }
		},

	}

</script>

<style>

.image-viewer .vdr-container.active {
    overflow: hidden;
    position: relative;
}

.tab-container {
    display: inline-flex;
    flex-direction: row;
    /* flex-wrap: wrap; */
    width: 100%;
}

</style>
