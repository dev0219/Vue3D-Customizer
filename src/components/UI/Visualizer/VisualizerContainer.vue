
<template>
	<div id="variant-customizer-visualizer-container">
		<!-- <div ref="processingOverlay" class="processingOverlay"></div>
		<div ref="processingString" class="processing-string">
			Processing...
		</div> -->

		<renderer ref="renderer"
		:resize="true" antialias
		:orbit-ctrl="{ enableDamping: true, dampingFactor: 0.10 }">
			
			<camera :position="{ z: 10 }" ref="camera"></camera>
			<scene background="#ffffff" ref="scene">
        		<AmbientLight
				color="#ffffff"
				intensity="0.5"
				/>

				<Mesh ref="mesh">
					<!-- <BoxGeometry ref="box"/> -->
					<CustomMaterial ref="material"></CustomMaterial>
					
				</Mesh>

			<!-- for shadow catcher -->
				<!-- <Plane :width="10" :height="10"
				:position="{ y: -2 }"
				:rotation="{x: - Math.PI / 2}">
					<StandardMaterial/>
				</Plane> -->

			</scene>

    <EffectComposer>
      <RenderPass />
      <SMAAPass />
      <UnrealBloomPass :strength="0.2" :threshold="0.7" />
      <FXAAPass />
    </EffectComposer>

		</renderer>

	</div>
</template>

<script>

	import {
		EffectComposer,
		UnrealBloomPass,
		RenderPass,
		GltfModel,
		FXAAPass
	} from 'troisjs';

	import {PMREMGenerator,sRGBEncoding, Color} from 'three'

	import CustomMaterial from '../../../modules/Visualizer/CustomMaterial'


	export default {
		components: {
			EffectComposer,
			UnrealBloomPass,
			RenderPass,
			FXAAPass,
			GltfModel,
			CustomMaterial
		},

		name: 'VisualizerContainer',

		mounted() {
			const renderer = this.$refs.renderer;

			renderer.onBeforeRender(() => {
				const canvas = renderer.renderer.domElement

				// look up the size the canvas is being displayed
				const width  = canvas.clientWidth
				const height = canvas.clientHeight
			
				// adjust displayBuffer size to match
				if (canvas.width !== width || canvas.height !== height) {
				this.$refs.renderer.three.setSize(width, height)
				// you must pass false here or three.js sadly fights the browser
				// this.renderer.setSize(width, height, false)
				this.$refs.camera.camera.aspect = width / height
				this.$refs.camera.camera.updateProjectionMatrix()

				// update any render target sizes here
				}
			});

            const pmremGenerator = new PMREMGenerator(renderer.renderer )
            pmremGenerator.compileEquirectangularShader()
			let hdrTexture = this.$store.getters['assets/getAssets']('hdr')
            var envMap = pmremGenerator.fromEquirectangular( hdrTexture ).texture
            envMap.encoding = sRGBEncoding

			let scene = this.$refs.scene.scene

            scene.environment = envMap
            scene.background  = new Color(0xfafafa)

			let model = this.$store.getters['assets/getAssets']('model')
			this.$refs.mesh.mesh.geometry = model.children[0].geometry
		}
	};

</script>