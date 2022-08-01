
<template>
	<div 
		:class="['ui-buttons','ui-components'].concat(config.params.className)"
		ref="container"
		v-if="checkDependency"
	>
		<label-container :label="config.params.label"></label-container>
		<div ref="buttonContainer">
			<button
				:config="config"
				:value="getOpValue(op)"
				:class="[currentlySelected == getOpValue(op)?'active':'inactive'
				,'button']"
				v-bind:style="{ background: getColor(op) }"
				v-bind:key="op.value"
				v-for="op in config.params.options"
				v-on:click="change(op.value)"
			>
			</button>
		</div>
	</div>
</template>

<script>

	import { isDefined, isObject, hexify } from "../../../helpers/helpers";
import { CONFIG } from '../../../modules/Managers/ConfigManager';
	import { checkDependency, getStateValue } from "../utils";

	import LabelContainer from "./LabelContainer.vue";

	export default {
		
		components: { LabelContainer },
		name: 'ButtonSelector',
		props: ['config'],

		computed : {

			currentlySelected: getStateValue,
			checkDependency: checkDependency,
			

		},

		methods: {

			change: function(value) {

				var params = {}
				var id = this.config.id
				params.value = value
				var category = this.config.params.route[0].path[0]
				this.$store.dispatch(category + '/inject', {id, params})

				// this.$store.dispatch('yarns/inject', {id, params}).then(() => {
					
				// 	var allStructures = CONFIG.getStructuresConfig()
				// 	var allYarns = this.$store.getters['yarns/getAll']
				// 	var payload = {}
					
				// 	this.$store.dispatch('utils/updatePreview', {
						
				// 	})
				// })
				

			},

			isColor: function(op) {
				
				return (CSS.supports('color', hexify(getOpValue(op))) || (isDefined(op.type) && op.type == 'color'))

			},

			getOpValue: function(op) {

				return (isObject(op) ? op.value : op);

			},

			getColor: function(op) {

				return (isObject(op) ? hexify(op.color) : hexify(op))
				
			}
			
		},

	}

</script>

<style>
</style>