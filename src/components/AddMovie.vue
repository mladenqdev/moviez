<template>
  <div class="add-movie">
	  <button v-if="!showForm" @click="openForm">Add Movies</button>
	  <form class="movie-form" @submit.prevent="handleSubmit">
		  <h4>Add a New Movie</h4>
		  <input type="text" placeholder="Movie title" required v-model="title">
		  <input @input="handleRating" type="number" placeholder="Your personal rating" required v-model="rating" step=".1">
		  <span v-if="ratingError" class="rating-error">Rating must be in the 1-10 range</span>
		  <span v-if="movieNotFound" class="rating-error">Movie not found. Please input the exact name of the movie. Also possible that the movie isn't in our database, but you can try different title! (:</span>
		  <button :disabled="ratingError">Add</button>
	  </form>
	  <button class="close-form" @click="closeForm">X</button>
	  <div @click.self="closeMenu" class="selection-menu-container">
		  <div class="selection-menu">
			<button class="close-menu" @click="closeMenu">X</button>
			<span class="selection-menu-query">Which of these movies, did you have in mind?</span>
			<div @click="handleMovieSelection(movie)" v-for="movie in topSearchResults" :key="movie.imbdID" class="selection-movie">
				<div class="selection-movie-img-container">
					<img class="selection-movie-img" :src="movie.Poster" alt="movie poster">
				</div>
				<span class="selection-movie-title"><strong>Movie title:</strong> {{ movie.Title }}</span>
				<span class="selection-movie-year"><strong>Year released:</strong> {{ movie.Year }}</span>
			</div>
		</div>
	  </div>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import useDocument from '@/composables/useDocument'
import youtube from '@/apis/youtube';

export default {
	props: ['list'],
	setup(props) {
		const title = ref('')
		const rating = ref('')
		const ratingError = ref(false)
		const movieNotFound = ref(false)
		const showForm = ref(false)
		const topSearchResults = ref([])
		const exactMatch = ref([])
		const personalRating = ref(0)
		const { updateDoc } = useDocument('lists', props.list.id)

		const handleRating = () => {
			if (rating.value < 1 || rating.value > 10) {
				ratingError.value = true
			} else if (rating.value === '') {
				ratingError.value = false
			} else {
				ratingError.value = false
			}
		}

		const openForm = (e) => {
			showForm.value = true;
			const form = e.target.parentElement.children[1];
			const button = e.target.parentElement.children[2];
			form.classList.add('movie-form--open');
			form.children[1].focus({preventScroll: true});
			form.scrollIntoView({behavior: "smooth"});
			button.style.display = 'block'
		}

		const closeForm = (e) => {
			const form = e.target.parentElement.querySelector('.movie-form');
			const button = e.target;
			showForm.value = false;
			form.classList.remove('movie-form--open')
			button.style.display = 'none'
		}

		const closeMenu = () => {
			const menu = document.querySelector('.selection-menu');
			const menuParent = menu.parentElement;
			const body = document.getElementsByTagName("BODY")[0];
			menu.classList.remove('selection-menu--open');
			menuParent.classList.remove('selection-menu-container--open')
			body.style.overflow = 'auto';
		}

		const handleSubmit = async (e) => {
			if (rating.value > 0 && rating.value < 11) {

				personalRating.value = rating.value;

				const form = document.querySelector('.movie-form');

				// 20b350b5
				const idFetchUrl = `https://www.omdbapi.com/?s=${title.value}&apikey=1cdc02c2`

				const idFetch = await fetch(idFetchUrl);
				const idFetchJson = await idFetch.json();

			// 	try {
            //     const response = await fetch(`https://imdb-api.com/en/API/SearchSeries/k_n7txtjch/${title.value}`);
            //      const data = await response.json();
            //      console.log(data);
            //    } catch(error) {
            //       console.log(error)
            //      }

				if (idFetchJson.Search) {
					topSearchResults.value = [idFetchJson.Search[0], idFetchJson.Search[1], idFetchJson.Search[2]];

					for (const i = ref(0); i.value < idFetchJson.Search.length; i.value++) {
						if(title.value.trim().toLowerCase() === idFetchJson.Search[i.value].Title.trim().toLowerCase()) {
							exactMatch.value.push(idFetchJson.Search[i.value]);
						}
					}
					topSearchResults.value = exactMatch.value;
				}



				form.children[1].focus({preventScroll: true});
				form.scrollIntoView({behavior: "smooth"});

				if (movieNotFound.value = true) {
					movieNotFound.value = false;
				}

				title.value = ''
				rating.value = ''
				ratingError.value = false
				if (exactMatch.value.length === 1) {
					handleMovieSelection(exactMatch.value[0])
				} else if (exactMatch.value.length > 1) {
					const menu = document.querySelector('.selection-menu');
					const menuParent = menu.parentElement;
					const body = document.getElementsByTagName("BODY")[0];

					menu.classList.add('selection-menu--open');
					menuParent.classList.add('selection-menu-container--open')
					body.style.overflow = 'hidden'
				} else {
					movieNotFound.value = true;
				}
				exactMatch.value = [];
			}
		}

		const handleMovieSelection = async (e) => {

			const newMovie = {
				title: title.value,
				rating: rating.value,
				id: Math.floor(Math.random() * 10000000)
			}

			const response = await youtube.get('/search', {
				params: {
					q: `${e.Title} ${e.Year} trailer`
				}
			});

			const imdbId = e.imdbID;

			const url = `https://www.omdbapi.com/?i=${imdbId}&apikey=1cdc02c2`

			const movieInfo = await fetch(url);
			const movieInfoJson = await movieInfo.json();

			newMovie.title = movieInfoJson.Title;
			newMovie.rating = personalRating.value;
			newMovie.director = movieInfoJson.Director;
			newMovie.imdbRating = movieInfoJson.imdbRating;
			newMovie.actors = movieInfoJson.Actors;
			newMovie.plot = movieInfoJson.Plot;
			newMovie.runtime = movieInfoJson.Runtime;
			newMovie.year = movieInfoJson.Year;
			newMovie.imdbLink = `https://www.imdb.com/title/${movieInfoJson.imdbID}`

			newMovie.trailer = `https://www.youtube.com/embed/${response.data.items[0].id.videoId}`;
			newMovie.thumbnail = `${response.data.items[0].snippet.thumbnails.medium.url}`;

			await updateDoc({
				movies: [...props.list.movies, newMovie]
			});

			const menu = document.querySelector('.selection-menu');
			const menuParent = menu.parentElement;
			const form = document.querySelector('.movie-form');

			form.scrollIntoView({behavior: "smooth"});

			if (menu.classList.contains('selection-menu--open')) {
				const body = document.getElementsByTagName("BODY")[0];
				menu.classList.remove('selection-menu--open');
				menuParent.classList.remove('selection-menu-container--open')
				body.style.overflow = 'auto'
			}

		}

		return { title, rating, ratingError, showForm, handleRating, handleSubmit, openForm, closeForm, topSearchResults, handleMovieSelection, closeMenu, movieNotFound }
	}
}
</script>

<style scoped>
	.add-movie {
		text-align: center;
		margin: 40px 0 20px;
		position: relative;
	}
	.movie-form {
		max-width: 100%;
		text-align: left;
		position: relative;
		display: none;
	}
	.movie-form--open {
		display: block;
	}
	.close-form {
		position: absolute;
		right: 10px;
		top: 0;
		display: none;
	}
	.close-menu {
		position: absolute;
		margin-top: 0;
		top: 6px;
		padding: 4px 9px;
		z-index: 5;
		border-radius: 50%;
		right: 6px;
		color: white;
    	background: var(--primary);
	}
	.close-menu:hover {
		color: var(--primary);
    	background: var(--secondary);
	}
	.rating-error {
		display: block;
		font-size: 13px;
		color: var(--warning);
	}
	.selection-menu-container {
		position: fixed;
		top: 0;
		bottom: 0;
		width: 100%;
		left: 0;
		background-color: rgba(0, 0, 0, 0.9);
		z-index: 5;
		opacity: 0;
		visibility: hidden;
		transition: 0.4s ease;
	}
	.selection-menu-container--open {
		opacity: 1;
		visibility: visible;
	}
	.selection-menu {
		display: flex;
		width: 30%;
		justify-content: space-between;
		padding: 50px 20px 20px;
		background: var(--primary);
		border-radius: 20px;
		position: fixed;
		top: -100%;
		left: 50%;
		transform: translateX(-50%);
		transition: 0.8s ease;
		border: 2px solid var(--secondary);
	}
	.selection-menu--open {
		top: 10%;
	}
	.selection-menu-query {
		position: absolute;
		color: white;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		top: 12px;
		font-size: 15px;
	}
	.selection-movie {
		display: flex;
		flex-direction: column;
		cursor: pointer;
		transition: transform 0.3s ease;
		flex: 1 1 0;
    	margin-right: 10px;
	}
	.selection-movie:last-child {
		margin-right: 0;
	}
	.selection-movie:hover {
		transform: scale(1.03);
	}
	.selection-movie-img-container {
		overflow: hidden;
	}
	.selection-movie-img {
		border-radius: 15px;
		max-width: 100%;
	}
	.selection-movie span {
		color: white;
		font-weight: 200;
    	font-size: 14px;
	}
	.selection-movie span strong {
		display: block;
	}
	@media only screen and (max-width: 875px) {
		.selection-movie-img {
			max-width: 85%;
		}
		.selection-menu {
			top: -150%;
			width: 95%;
			padding: 40px 10px 15px;
		}
		.selection-menu--open {
			top: 50px;
		}
		.selection-menu-query {
			font-size: 13px;
		}
	}
</style>