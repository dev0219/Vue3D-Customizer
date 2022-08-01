 
<template>
	<div class="ui-label">
		<div class="label-text">{{label}}</div>
	</div>
</template>

<script>

	export default {

		name: 'LabelContainer',
		props: ['label'],

		mounted () {

			this.$emit('mounted')

		}

	}

</script>

<style>
</style>
