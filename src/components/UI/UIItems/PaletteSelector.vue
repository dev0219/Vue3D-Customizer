 
<template>
	<div v-if="currentValue"
	:class="['ui-palette', 'ui-components'].concat(config.params.className)"
	>
		<label-container :label="config.params.label"></label-container>
		
		<button 
		:class="['palette-button'].concat(index==active? 'active': '')"
		v-bind:key="index"
		v-for="(palette, index) in currentValue"
		v-bind:style="{ background:getColor(palette) }"
		@click="setActive(index)"
		>
		</button>

	</div>

	
	<div
		v-if="showColorPicker==true"
		style='position:relative'>
		<ColorPicker
			class="editor-color-picker"
			:key="active"
			theme=""
			:color="colorPickerColor"
			:sucker-hide="false"
			@changeColor="changeColor"
			@openSucker="openSucker"
			v-click-outside="hideColorPicker"

		/>
	</div>

	<button 
		class="fake-button spaced-bottom"
		@click="reprocessImage"
		style="width:100%; margin-top:15px;"
		>
		Update Palette
	</button>

	<!-- <div v-if="showColorPicker" class="outside" v-on:click="hideColorPicker"></div> -->

</template>

<script>

  	import { ColorPicker } from 'vue-color-kit'
	import LabelContainer from "./LabelContainer.vue";
	import { onChange, getStateValue } from "../utils";
	import { isDefined, rgbaToHex } from '../../../helpers/helpers';

	export default {

		name: 'PaletteSelector',
		components: {
			LabelContainer,
			ColorPicker,
		},

		data() {
			return {

				showColorPicker: false,
				color: '#ffffff',
				suckerCanvas: null,
				suckerArea: [],
				isSucking: false,

				mouseIsDown: false,
				
				active: 0,

			}
		},

		props: ['config'],
		computed : {

			currentValue: getStateValue,

			colorPickerColor() {
				if (isDefined(this.active) && isDefined(this.currentValue)) {
					console.log(this.getColor(this.currentValue[this.active]))
					return this.getColor(this.currentValue[this.active])
				} else {
					console.log('returning none....')
					return '#00000000'
				}
			}
		},

		methods: {
			// onChange : onChange,
			// mousedown() {
			// 	this.mouseIsDown = true
			// 	console.log('mouse is down')
			// },

			// mouseup() {
			// 	this.mouseIsDown = false
			// 	console.log('mouse is up!')
			// },

			reprocessImage() {

				var params = {}
				
				let route = this.config.params.route
				var category    = route[0].path[0]
        		var id          = route[0].path[1]

				params[route[0].key[0]] = { refresh : true }

				this.$store.dispatch(category + '/inject', {id, params})

			},

			hideColorPicker() {
				this.showColorPicker = false
			},

			getColor(palette) {

				var r = palette.r
				var g = palette.g
				var b = palette.b
				var a = palette.a
				console.log(r,g,b,a)
				console.log(palette)
				return rgbaToHex(r,g,b,a)

			},

			setActive(index) {

				this.active = index
				this.showColorPicker = true;

			},

			changeColor(event) {
				
				if (this.mouseIsDown) return
				
				event['active'] = this.active
				var fakeEvent = {}
				fakeEvent['target'] = {}
				fakeEvent.target['value'] = event
				fakeEvent.target.value.rgba.a *= 255

				console.log(this.active, event)
				console.log(fakeEvent)
				var boundOnChange = onChange.bind(this) 
				boundOnChange(fakeEvent)
				
			},

			openSucker() {

			}
		},

	}

</script>

<style>

.editor-color-picker {

   position: absolute;
   right: 0px;
   left: auto;

}

</style>
