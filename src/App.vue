<template>
<Navbar />
	<div class="content">
		<router-view/>
	</div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
	components: { Navbar }
}
</script>

<style>
	#app {
		margin-top: 20px;
	}
	.content {
		margin: 0 auto;
		max-width: 1200px;
		padding: 0 20px;
	}
	@media only screen and (max-width: 875px) {
		#app {
			margin-top: 150px;
		}
	}
</style>
