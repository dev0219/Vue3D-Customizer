<template>

	<div id='variant-canvas-container'
		v-bind:style="toggled? '' : 'width:0;padding-right:0' "
		v-dragscroll="true"
		@keyup.space="showDragMask=true"
		@mouseover="hovering = true"
		@mouseleave="showDragMask == false ? hovering = false : null">

		<button 
			class="canvas-maximize"
			@click="toggleExpand">
			<font-awesome-icon :icon="['fas', 'angle-right']"
								v-if="toggled" ></font-awesome-icon>
			<font-awesome-icon :icon="['fas', 'angle-left']"
								v-else ></font-awesome-icon>
		</button>

		<CanvasStage
		:reprocessCache="reprocessCache" />

		<div data-dragscroll
			v-if="showDragMask == true"
			class="dragMask"
			v-bind:style="'width:' + maskSize + 'px; height:' + maskSize +'px'">
		</div>
	</div>

</template>

<script>

	// @will TODO: create handler for changing from Editor to Customizer
	import CanvasStage from './CanvasStage.vue'
	import { library } from '@fortawesome/fontawesome-svg-core'
    import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
	import { CONFIG } from '../../modules/Managers/ConfigManager'
	import { dragscroll } from 'vue-dragscroll'

	library.add(faAngleRight)
	library.add(faAngleLeft)
	const width = CONFIG.getProductConfig().size;

	export default {

		components: {
			CanvasStage,
		},

		created() {
			window.addEventListener('keypress', this.turnOnMask);
			window.addEventListener('keyup', this.turnOffMask);
		},
		destroyed() {
			window.removeEventListener('keypress', this.turnOnMask);
			window.removeEventListener('keyup', this.turnOffMask);
		},

		directives: {
			dragscroll
		},

		props: ['customizerReady'],

		data() {
			return {

				toggled : true,
				showDragMask : false,
				hovering: false,
				maskSize : width

			}
		},

		methods: {
			
			// hacky....
			turnOnMask(e) {
				if (e.key == ' ' && this.hovering && e.target.nodeName == 'BODY')  {
					e.preventDefault()
					this.showDragMask = true
				}

			},

			turnOffMask(e) {
				if (e.key == ' ') this.showDragMask = false
			},
			
			toggleExpand() {

				this.toggled = !this.toggled


			}

		}

	}

</script>

<style>

.dragMask {
	position: absolute;
    top: 0;
    left: 0;
	cursor: grab;

}

.dragmask:active {
	cursor: grabbing;
}
	
</style>