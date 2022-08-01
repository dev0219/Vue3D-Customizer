
<template>
	<div id="variant-customizer-loading-container"
	:class="{hide: loadPercentage == 100}">
		<div class="loading-data">
			<div class="loading-text">
				Loading... {{loadPercentage}}%
			</div>

			<div class="loading-bar">
				<div ref="progressBar" class="loading-bar-progress"
				:style="'width:' + loadPercentage + '%'"></div>
			</div>
		</div>
	</div>
</template>

<script>

	export default {

		name: "LoaderContainer",

		computed: { 
			
			loadPercentage() {
				var value = this.$store.getters['utils/getInterface']('loadPercentage')
				if(value == 100) {
 					setTimeout(()=>{
						 let getElementEmpty = document.createElement('div')
						getElementEmpty.id = 'rendered-3d';
						var customerContainer = document.getElementById('variant-customizer-container')
						customerContainer.appendChild(getElementEmpty);
					},3000)
				}				  
				return String(value)
			},
			
		}

	}

</script>

<style>

	#variant-customizer-loading-container.hide {
		transition: 1.5s;
		opacity:0;
		pointer-events:none
	}

</style>
