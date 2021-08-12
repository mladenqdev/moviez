<template>
  <div v-for="(list, index) in lists" :key="list.id">
	  <router-link :to="{ name: 'ListDetails', params: {id: list.id} }">
		  <div class="single">
			<div class="thumbnail">
				<img :src="list.coverUrl" alt="list cover image">
			</div>
			<div class="info-container">
				<div class="info">
					<h3>{{ list.title }}</h3>
					<p>Created by {{ list.userName }}</p>
					<p>{{ list.description }}</p>
				</div>
				<div class="movie-number">
					<p v-if="list.movies.length > 0">Number of movies: {{ list.movies.length }}</p>
					<p v-if="list.movies.length > 0">Average IMDb rating: {{ averageImdbRating[index] }}</p>
					<p v-if="list.movies.length > 0">Average personal rating: {{ averageRating[index] }}</p>
					<p class="no-movies" v-if="list.movies.length == 0">User is yet to add a movie to this list.</p>
				</div>
			</div>
		</div>
	  </router-link>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { onMounted } from 'vue'
export default {
	props: ['lists'],
	setup(props) {
		const averageRating = ref([])
		const averageImdbRating = ref([])
		const calcRating = ref([])

		onMounted( () => {
			// console.log(props.lists[0].movies)
			props.lists.forEach((list) => {
				const sum = ref(0);
				const sumImdb = ref(0);
				list.movies.forEach((movie) => {
					sum.value += Number(movie.rating);
					sumImdb.value += Number(movie.imdbRating);
				})
				averageRating.value.push((sum.value/list.movies.length).toFixed(2))
				averageImdbRating.value.push((sumImdb.value/list.movies.length).toFixed(2))
			})
		})



		return { averageRating, calcRating, averageImdbRating }
	}
}
</script>

<style scoped>
	.no-movies {
		position: relative;
	}
	.single {
		display: flex;
		align-items: center;
		padding: 20px;
		border-radius: 10px;
		background: rgb(68, 68, 68);
		margin: 16px 0;
		transition: 0.2s ease;
		opacity: 0.9;
	}
	.single:hover {
		box-shadow: 1px 2px 3px rgba(50,50,50,0.05);
		transform: scale(1.02);
		transition: 0.2s ease;
	}
	.thumbnail {
		max-width: 100px;
		max-height: 100px;
		overflow: hidden;
		border-radius: 10px;
	}
	img {
		max-width: 150%;
		max-height: 150%;
		display: block;
		margin-left: -20px;
	}
	.info {
		margin: 0 30px;
	}
	.info h3, .info p {
		color: white;
		margin-bottom: 5px;
	}
	.info p {
		opacity: 0.6;
	}
	.info p:last-child {
		margin-bottom: 0;
	}
	.movie-number {
		margin-left: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.movie-number p {
		color: white;
		margin-bottom: 5px;
		opacity: 0.7;
	}
	.movie-number p:last-child {
		margin-bottom: 0;
	}
	.info-container {
		    display: flex;
    		width: 100%;
	}
	@media only screen and (max-width: 875px) {
		.single {
			flex-direction: column;
		}
		.thumbnail {
			    max-width: 60%;
				max-height: 200px;
				margin-bottom: 10px;
		}
		.info-container {
			flex-direction: column;
		}
		.info {
			margin: 0 0 20px;
			text-align: center;
		}
		.movie-number {
			text-align: center;
			margin-left: 0;
		}
		img {
			margin-left: -40px;
		}
	}

</style>