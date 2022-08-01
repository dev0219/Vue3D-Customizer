 
<template>
	<div :class="['ui-number', 'ui-components'].concat(config.params.className)"
	v-if="checkDependency">
		<label-container :label="config.params.label"></label-container>
		<input
			:max="config.params.max"
			:min="config.params.min"
			:value="currentValue"
			ref="input"
			type="number"
			@change="onChange($event)"
		/>
	</div>
</template>

<script>

	import LabelContainer from "./LabelContainer.vue";
	import { onChange, getStateValue, checkDependency } from "../utils";

	export default {

		name: 'NumberInput',
		components: { LabelContainer },
		props: ['config'],

		computed : {
			currentValue: getStateValue,
			checkDependency : checkDependency
		},

		methods: {
			onChange : onChange,
		},

	}

</script>

<style>
</style>
