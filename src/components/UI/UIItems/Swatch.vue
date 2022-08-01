 
<template>
	<div :class="['ui-swatch', 'ui-components', config.className]">
		<label-container
			v-if="!!config.label"
			:label="config.label"
		></label-container>
		<div ref="swatchContainer" class="swatch-container">
			<input 
				ref="hiddenInput"
				type="hidden" 
				v-on:hidden-change="hiddenChange"
			/>
			<div ref="swatch" class="swatch"></div>
		</div>
	</div>
</template>

<script>

	import LabelContainer from "./LabelContainer.vue";

	export default {

		name: 'Swatch',
		components: { LabelContainer },
		props: ['config'],
		methods: {

			hiddenChange: function(e) {

				this.$refs.swatch.style.background = e.target.value

			},

			currentValue : currentValue


		},

	}

</script>

<style>
</style>
