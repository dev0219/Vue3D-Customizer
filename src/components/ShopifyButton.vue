
<template>
	<div ref="loaderDiv" class="pretend-to-be-shopify-template-button">
		<button class="shopify-button" onclick="triggerCustomizerStart()">Customize</button>
		<div style="display: none">
			<button id="shopifyAddToCart" type="button" name="add" class="button color customizer-add-cart" onsubmit="return false;">
				<span class="add-to-cart-text">Add to cart</span>
				<span class="star-loading">
					<i></i>
					<i></i>
					<i></i>
				</span>
			</button>
		</div>
	</div>
</template>

<script>

	export default {

		name: 'ShopifyButton',

		mounted () {

		}

	}

</script>

<style>

	.pretend-to-be-shopify-template-button{
		width: 100vw;
		background: #fff;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
		position: fixed;
		transition: 0.5s;
	}

	.shopify-button{
		padding: 10px 20px;
		font-size: 16px;
		text-align: center;
		outline: 0 none;
		border: 1px solid #000;
		background-color: white;
		color: #000;
		cursor: pointer;
	}
	
</style>