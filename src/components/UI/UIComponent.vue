<template>

	<block
		:config="config"
		v-if="config.type == 'block'"
	></block>
	<text-input
		:config="config"
		v-else-if="config.type == 'text'"
	></text-input>
	<number-input
		:config="config"
		v-else-if="config.type == 'number'"
	></number-input>
	<slider-input
		:config="config"
		v-else-if="config.type == 'slider'"
	></slider-input>
	<selector
		:config="config"
		v-else-if="config.type == 'selector'"
	></selector>
	<upload-button
		:config="config"
		v-else-if="config.type == 'file'"
	></upload-button>
	<image-container
		:config="config"
		v-else-if="config.type == 'image'"
	></image-container>
	<button-selector
		:config="config" 
		v-else-if="config.type == 'button'">
	</button-selector>
	<palette-selector
		:config="config" 
		v-else-if="config.type == 'palette'">
	</palette-selector>
	<image-setup
		:config="config" 
		v-else-if="config.type == 'image-setup'">
	</image-setup>


</template>

<script>
	
	import Block from './UIItems/Block.vue'
	import ButtonSelector from './UIItems/ButtonSelector.vue'
	import ImageContainer from './UIItems/ImageContainer.vue'
	import NumberInput from './UIItems/NumberInput.vue'
	import Selector from './UIItems/Selector.vue'
	import SliderInput from './UIItems/SliderInput.vue'
	import TextInput from './UIItems/TextInput.vue'
	import UploadButton from './UIItems/UploadButton.vue'
	import PaletteSelector from './UIItems/PaletteSelector.vue'
	import ImageSetup from './UIItems/ImageSetup.vue'

	export default {

		components: { 
			Block,
			ButtonSelector,
			ImageContainer,
			NumberInput,
			Selector,
			SliderInput,
			TextInput,
			UploadButton,
			PaletteSelector,
			ImageSetup
		},
		name: 'UIComponent',
		props: ['config'],	

	}

</script>

<style>
</style>