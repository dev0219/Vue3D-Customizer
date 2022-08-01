 
<template>
	<div :class="['ui-palette', 'ui-components'].concat(config.params.className)">
		<label-container :label="config.params.label"></label-container>


	</div>
</template>

<script>

  	import { ColorPicker } from 'vue-color-kit'
	import LabelContainer from "./LabelContainer.vue";
	import { onChange, getStateValue } from "../utils";
	import { rgbaToHex } from '../../../helpers/helpers';

	export default {

		name: 'PaletteSelector',
		components: {
			LabelContainer,
			ColorPicker
		},

		data() {
			return {
				color: '#59c7f9',
				suckerCanvas: null,
				suckerArea: [],
				isSucking: false,
			}
		},

		props: ['config'],
		computed : {
			currentValue: getStateValue,
		},

		methods: {
			onChange : onChange,

			getColor(palette) {

				var r = palette.r
				var g = palette.g
				var b = palette.b
				var a = palette.a

				return rgbaToHex(r,g,b,a)

			}
		},

	}

</script>

<style>
</style>
