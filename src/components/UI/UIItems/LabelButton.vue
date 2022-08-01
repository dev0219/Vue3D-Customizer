 
<template>
	<button
		:class="['ui-label', 'ui-button']"
		v-on:click="toggleAccordion"
	>
		<div class="label-text">{{label}}</div>
	</button>
</template>

<script>

	export default {

		name: 'LabelButton',
		props: ['label'],
		methods: {

			toggleAccordion: function (e) { this.$emit('toggleAccordion') },

		},

		mounted () {

			this.$emit('mounted')

		}

	}

</script>

<style>
</style>
