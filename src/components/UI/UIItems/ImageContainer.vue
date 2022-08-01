
<template>
	<div v-if="currentValue"
		:class="['ui-components'].concat(config.params.className)">
		<label-container
			v-if="config.params.label"
			:label="config.params.label">
		</label-container>
		<div 
			:class="canvasClasses">
			<img
				:src="currentValue.src"
			>
		</div>
	</div>
</template>

<script>

	import { getStateValue } from '../utils';
	import LabelContainer from "./LabelContainer.vue";

	export default {

		components: { LabelContainer },
		name: 'ImageContainer',
		props: ['config'],
		methods: {

		},

		data () {

			return {
				canvasClasses: ['checkered-bg']
			}
			
		},

		computed: {
			
			currentValue: getStateValue,

		},

	}

</script>

<style>
</style>
