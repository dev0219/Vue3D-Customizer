 
<template>
	<div :class="['ui-selector', 'ui-components'].concat(config.params.className)"
		v-if="checkDependency">
		<label-container
			v-if="!!config.params.label"
			:label="config.params.label"
		></label-container>
		<select ref="selectEl"
			:value="currentValue"
			@change="onChange($event)">
			<option 
				v-bind:key="op.id"
				:config="op"
				v-for="op in config.params.options"
				:value="isObject(op) ? op.id : op">
				{{isObject(op) ? op.name : op}}
			</option>
		</select>
	</div>
</template>

<script>

	import LabelContainer from "./LabelContainer.vue";
	import { isObject } from "../../../helpers/helpers";
	import { checkDependency, getStateValue, onChange } from "../utils";

	export default {

		components: { LabelContainer },
		name: 'Selector',
		props: ['config'],
		
		methods: {

			isObject: function (op) { return isObject(op) },
			onChange : onChange

		},

		computed : {

			currentValue: getStateValue,
			checkDependency: checkDependency,

			structurePreviews() {
				return this.$store.getters['utils/getStructurePreviews']()
			}

		},

	}

</script>

<style>
</style>
