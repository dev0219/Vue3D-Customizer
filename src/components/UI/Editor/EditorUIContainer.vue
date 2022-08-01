
<template>
	<div id="variant-editor-ui-container">

        <yarn-selector
		v-on:vnode-mounted="onChildMount()"/>

		<layer-detail
		v-on:vnode-mounted="onChildMount()"/>

		<item-detail
		v-on:vnode-mounted="onChildMount()"/>

		<!-- <simulation-trigger/> -->

	</div>
</template>

<script>

// Main container for Editor UI

	import ItemDetail from './ItemDetail.vue'
	import LayerDetail from './LayerDetail.vue'
	import YarnSelector from './YarnSelector.vue'

	export default {

		components: {LayerDetail, ItemDetail, YarnSelector},

		data() {
			return {
				totalMounted : 0
			}
		},

		watch: {
			totalMounted() {
				if (this.$data.totalMounted == 3)
					var id = 'uiReady'
					var value = 1
					this.$store.commit('utils/update', {id, value})
			}
		},

		methods: {
			onChildMount() {
				this.$data.totalMounted += 1
			}
		}

		
    }
	

</script>

<style>
</style>