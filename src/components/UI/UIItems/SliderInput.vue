 
<template>
	<div :class="['ui-slider', 'ui-components'].concat(config.params.className)"
	v-if="checkDependency">
		<label-container :label="config.params.label"></label-container>
		<input
			:max="config.params.max"
			:min="config.params.min"
			:value="getValue"
			ref="slider"
			type="range"
		/>
	</div>
</template>

<script>

	import LabelContainer from "./LabelContainer.vue";
	import { getStateValue } from "../utils";

	export default {

		components: { LabelContainer },
		name: 'SliderInput',
		props: ['config'],

		computed: {

			getValue() {
				if (this.config.params.route) {
					var stateValue = getStateValue(this)
					return stateValue
				}
			}

		}

	}

</script>

<style>
</style>
