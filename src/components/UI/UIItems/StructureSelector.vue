 
<template>
	<div :class="['ui-components'].concat(config.params.className)"
		v-if="checkDependency">
		<label-container
			v-if="!!config.params.label"
			:label="config.params.label"
		></label-container>
		
		<div 
		v-bind:key="value + '_' + index "
		v-for="(value, index) in currentValue"
		class="dropdown">
            <button class="btn btn-success 
                    dropdown-toggle structure-button checkered-bg" type="button" 
                    id="dropdownMenuButton" 
                    data-toggle="dropdown"
                    aria-haspopup="true" 
                    aria-expanded="false"
					:style="value == 'none'? '' : 'background: url(' + structurePreviews[value] +')'">
            </button>

			<div class="dropdown-content">
                <button 
					v-bind:key="option.id"
					:class="['dropdown-item', 'checkered-bg', 'structure-button', currentValue[index] == option.id? 'active' : '']"
					v-for="option in options"
					:label="'change structure ' + index + ' to ' + option.id"
					@click="changeValue(index, option.id)"
					:style="option.id == 'none'? '' : 'background: url(' + structurePreviews[option.id] +')'">
				</button>
			</div>
        </div>


	</div>
</template>


<script>

	import LabelContainer from "./LabelContainer.vue";
	import { onChange, getStateValue, checkDependency } from "../utils";
	import { CONFIG } from '../../../modules/Managers/ConfigManager';

	export default {

		name: 'StructureSelector',
		components: {
			LabelContainer,
		},

		data() {
			return {

				options: CONFIG.getStructuresConfig(),
				previews: {}

			}
		},

		props: ['config'],
		computed : {

			currentValue: getStateValue,
			checkDependency: checkDependency,
			
			structurePreviews() {
				return this.$store.getters['utils/getStructurePreviews']()
			}

			

		},

		methods: {
			onChange : onChange,

			// @Will: this should probably be in its own class
			// but adding this hackily for NBC / Black Crows visit
			

			changeValue(index, value) {

				var fakeEvent = {}
				fakeEvent['target'] = {}
				fakeEvent.target['value'] = {
					active: index,
					value: value
				}

				var boundOnChange = onChange.bind(this) 
				boundOnChange(fakeEvent)
				
			},

			getStructurePreview(value) {

			}


		},

	}

</script>

<style>

.dropbtn {
	background-color: #4CAF50;
	color: white;
	padding: 16px;
	font-size: 16px;
	border: none;
	cursor: pointer;
}

.dropdown {
	position: relative;
	display: inline-block;
	z-index: 5;
}

.dropdown-content {
	display: none;
	position: absolute;
	background-color: #f9f9f9;
	box-shadow: 0px 8px 16px 
		0px rgba(0, 0, 0, 0.2);
	z-index: 1;
}

.dropdown-content button {
	color: black;
	padding: 12px 16px;
	text-decoration: none;
	display: block;
	margin: 0 !important;
	padding: 5px;
}

.dropdown-content a:hover {
	background-color: #f1f1f1
}

.dropdown:hover .dropdown-content {
	display: block;
}

.dropdown:hover .dropbtn {
	background-color: #3e8e41;
}

</style>
