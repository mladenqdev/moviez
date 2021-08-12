<template>
  <div class="home">
	  <div class="title-container">
		  <h1 class="words word-1">
			<span>S</span>
			<span>H</span>
			<span>A</span>
			<span>R</span>
			<span>E</span>
		</h1>

		<h1 class="words word-2">
			<span>Y</span>
			<span>O</span>
			<span>U</span>
			<span>R</span>
		</h1>

		<h1 class="words word-3">
			<span>M</span>
			<span>O</span>
			<span>V</span>
			<span>I</span>
			<span>E</span>
			<span>S</span>
		</h1>
	  </div>
	  <div v-if="error" class="error">Could not fetch the data</div>
	  <div v-if="documents">
		  <ListView :lists="documents" />
	  </div>

  </div>
</template>

<script>
import ListView from '../components/ListView.vue'
import getCollection from '../composables/getCollection'

export default {
  name: 'Home',
  components: { ListView },
  setup() {
	  const { error, documents} = getCollection('lists')

	  return { error, documents }
  }
}
</script>

<style>
	.home {
		margin-bottom: 120px;
	}
	.title-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.words {
		font-size: 0;
		line-height: 1.5;
		margin-right: 50px;
	}

	.words:last-child {
		margin-right: 0;
	}

	.words span {
		color: rgba(0, 0, 0, 0.08);
		font-size: 45px;
		display: inline-block;
		animation: move 3s ease-in-out infinite;
	}

	@keyframes move {
	0% {
		transform: translate(-20%, 0);
	}
	50% {
		text-shadow: 0 25px 50px rgba(0, 0, 0, 1);
	}
	100% {
		transform: translate(20%, 0);
	}
	}

	.words span:nth-child(2) {
		animation-delay: 1s;
	}

	.words span:nth-child(3) {
		animation-delay: 2s;
	}

	.words span:nth-child(4) {
		animation-delay: 3s;
	}

	.words span:nth-child(5) {
		animation-delay: 4s;
	}

	.words span:nth-child(6) {
		animation-delay: 5s;
	}

	.words span:nth-child(7) {
		animation-delay: 6s;
	}
	@media only screen and (max-width: 875px) {
		.home {
			margin-bottom: 30px;
		}
		.words {
			margin-right: 30px;
		}
		.words span {
			font-size: 20px;
			color: rgba(0, 0, 0, 0.15);
		}
	}
</style>
