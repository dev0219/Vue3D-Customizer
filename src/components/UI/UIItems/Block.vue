
<template>
	<div 
		:class="['ui-block','ui-components'].concat(config.params.className)"
		ref="container"
		v-if="checkDependency"
	>
	<label-button 
		:label="config.params.label"
		:class="[{ 'clicked': isExpanded }, 'expandable']"
		@toggleAccordion="toggleAccordion"
		ref="label"
		v-if="config.params.collapsible"
	>
	</label-button>

	<label-container
		:label="config.params.label"
		v-else-if="config.params.collapsible == false">
	</label-container>


	<div 
		class="block-content-container"
		ref="contentContainer"
		:style="[isExpanded ? {'display' : 'block'} : {'display': 'none'}]"
	>
		<transition name="slide" v-if="isExpanded">
			<div class="block-child-container" v-if="isExpanded">

				<UIComponent
					v-bind:key="component.id"
					:config="component"
					v-for="component in config.children"
				>
				</UIComponent>

			</div>
		</transition>
	</div>
	</div>
</template>

<script>

	import { defineAsyncComponent } from '@vue/runtime-core';
	import LabelButton from "./LabelButton.vue";
	import LabelContainer from "./LabelContainer.vue"
	import { checkDependency } from '../utils';
	export default {

		components: {
			LabelButton, 
			LabelContainer,
			UIComponent : defineAsyncComponent(()=> Promise.resolve(import('../UIComponent.vue')))

		},
		name: 'Block',
		props: ['config'],
		
		data() { 
			
			return {
				isExpanded: true,
			} 
			
		},

		computed: {
			checkDependency: checkDependency
		},

		methods: {

			toggleAccordion: function () {
				this.isExpanded = !this.isExpanded;
			}

		},

		mounted() {
		}

	}

</script>

<style>

	/* todo: slide animation */
	.block-content-container {
		position: relative;
		overflow: hidden;
	}
	.slide-enter-active, .slide-leave-active {
		transition: all .6s ease;
	}
	.slide-enter, .slide-leave-to
	{
		transform: translateY(-100%);
		opacity: 0;
	}

</style>