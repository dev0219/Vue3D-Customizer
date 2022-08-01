 
<template>
	<div :class="['file-upload', 'ui-components'].concat(config.params.className)"
	v-if="checkDependency">
		<label-container :label="config.params.label"></label-container>
		
		<label class="fake-button">
			<input
				ref="uploadButton"
				type="file"
				accept="image/*"
				@change="onChange"
			>
			Upload
		</label>

	</div>
</template>

<script>

	import LabelContainer from "./LabelContainer.vue";
	import { checkDependency, getStateValue, onChange } from "../utils";
	
	export default {

		components: { LabelContainer },
		name: 'UploadButton',
		props: ['config'],

		computed : {
			currentValue: getStateValue,
			checkDependency : checkDependency,
		},

		methods: {

			onChange: onChange,

		},

	}

</script>

<style>
</style>
