<template>

	<div v-bind:id="sceneContainerId">

	<!-- temp disabling -->
		<!-- <shopify-button></shopify-button> -->
	<!-- temp disabling -->
		<!-- <loader-container></loader-container> -->
		<LoaderContainer/>
		<VisualizerContainer/>
		<CanvasContainer :customizerReady="this.customizerReady"/>
	<!-- This is for the case if Customizer is on -->
		<!-- <CustomizerUIContainer></CustomizerUIContainer> -->

	<!-- This is for the case if Editor is on -->
		<EditorUIContainer/>

	<!-- This is temporary -->
		<BMPExportButton/>
		
	</div>
</template>

<script>

	// @will TODO: create handler for changing from Editor to Customizer
	import { CONFIG } from './modules/Managers/ConfigManager'
	import { isDefined } from './helpers/helpers'

	import ShopifyButton from './components/ShopifyButton.vue'
	import VisualizerContainer from './components/UI/Visualizer/VisualizerContainer.vue'
	import LoaderContainer from './components/LoaderContainer.vue'
	import CanvasContainer from './components/Canvas/CanvasContainer.vue'
	import CustomizerUIContainer from './components/UI/Customizer/CustomizerUIContainer.vue'
	import EditorUIContainer from './components/UI/Editor/EditorUIContainer.vue'
	import BMPExportButton from './components/UI/BMPExportButton.vue'

	import "./style.scss"
	import 'vue-color-kit/dist/vue-color-kit.css'

	export default {

		components: {
			ShopifyButton,
			VisualizerContainer,
			LoaderContainer,
			CanvasContainer,
			CustomizerUIContainer,
			EditorUIContainer,
			BMPExportButton
		},

		data() {

			return {
				sceneContainerId : CONFIG.getWebsiteConfig().containerId,
				components		   : [],
				isDefined        : isDefined,
				customizerReady  : false,

			};

		},
		
		mounted () {
			// visualizer.init()
			var initializeStore = async function() {

				// Initializing all config
				var config  = CONFIG.getCustomizationConfig()   

				for (const category in config) {

					for (var c = 0; c < config[category].length; c++) {
						
						var element  = config[category][c]
						var type     = element.type
						var params   = element.params
						var name 	   = element.name
						var children = isDefined(element.children) ? element.children : []

						await this.$store.dispatch( category + '/createState', { type, params, children })
						
					}
				}

				console.log('Initialized Store!\n', this.$store.state)
				
				return new Promise((resolve, reject) => {resolve()})

			}.bind(this)

			initializeStore().then(()=> {

				// wait until store is initialized before processing material thru canvas
				console.log("process konva canvas...")
				this.$store.dispatch('utils/reprocess')
			})
			
		}

	}

</script>