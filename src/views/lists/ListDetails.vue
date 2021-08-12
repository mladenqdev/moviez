<template>
	<div v-if="error" class="error">{{ error }}</div>
	<div v-if="list" class="list-details">

		<!-- list information -->
		<div class="list-info">
			<div class="cover">
				<img :src="list.coverUrl" alt="list cover image">
			</div>
			<div class="list-desc">
				<h2>{{ list.title }}</h2>
				<p class="username">Created by {{ list.userName }}</p>
				<p class="description">{{ list.description }}</p>
				<button v-if="ownership" @click="handleDelete">Delete List</button>
			</div>
		</div>

		<!-- movie list -->
		<div class="movie-list">
			<div v-if="!list.movies.length">No movies have been added to this list yet.</div>
			<div v-for="movie in list.movies" :key="movie.id" class="single-movie">
				<div @click.self="hideModal" :class="{ 'video-player-container--active': modalOn}" class="video-player-container">
					<iframe class="video-player" title="video player" :src="movie.trailer"/>
				</div>
				<img @click="showModal" :src="movie.thumbnail" alt="movie thumbnail" class="video-img">
				<div class="imdb-info">
					<span class="movie-name"><strong>Title:</strong> {{ movie.title }}</span>
					<span class="movie-year"><strong>Released:</strong> {{ movie.year }}</span>
					<span class="director"><strong>Director:</strong> {{ movie.director }}</span>
					<span class="actors"><strong>Cast:</strong> {{ movie.actors }}</span>
					<span class="runtime"><strong>Runtime:</strong> {{ movie.runtime }}</span>
					<span class="imdb-rating"><strong><a :href="movie.imdbLink" target="_blank">IMDb</a> Rating:</strong> {{ movie.imdbRating }}</span>
					<span class="personal-rating"><strong>Personal Rating:</strong> {{ movie.rating }}</span>
				</div>
				<div class="plot-container">
					<button class="plot-button" @click="openPlotDesc">movie plot</button>
					<div class="plot-body">
						<p class="plot">{{ movie.plot }}</p>
					</div>
				</div>
				<button v-if="ownership" @click="handleClick(movie.id)">delete</button>
			</div>
			<AddMovie v-if="ownership" :list="list" />
		</div>
	</div>
</template>

<script>
import AddMovie from '@/components/AddMovie.vue'
import useStorage from '@/composables/useStorage'
import useDocument from '@/composables/useDocument'
import getDocument from '@/composables/getDocument'
import getUser from '@/composables/getUser'
import { computed } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

export default {
	props: ['id'],
	components: { AddMovie },
	setup(props) {
		const { error, document: list } = getDocument('lists', props.id)
		const { user } = getUser()
		const { deleteDoc, updateDoc } = useDocument('lists', props.id)
		const { deleteImage } = useStorage()
		const router = useRouter()

		const modalOn = ref(false)

		const showModal = (e) => {
			const body = document.getElementsByTagName("BODY")[0];
			const video = e.target.parentElement.querySelector('.video-player-container');
			const videos = document.querySelectorAll('.video-player-container');

			body.style.overflow = 'hidden'
			modalOn.value = true;

			videos.forEach((video) => {
				video.style.display = 'none'
			})

			video.style.display = 'flex'
		}

		const hideModal = (e) => {
			const video = e.target.parentElement.querySelector('.video-player');
			const body = document.getElementsByTagName("BODY")[0];
			modalOn.value = false;
			body.style.overflow = 'auto'
			video.src = video.src;
		}

		const ownership = computed(() => {
			return list.value && user.value && user.value.uid === list.value.userId
		})

		const handleDelete = async () => {
			await deleteImage(list.value.filePath)
			await deleteDoc()
			router.push({ name: 'Home' })
		}

		const handleClick = async (id) => {
			const movies = list.value.movies.filter((movie) => movie.id != id)
			await updateDoc({ movies })
		}

		const openPlotDesc = (e) => {
			const plotP = e.target.parentElement.children[1];
			const plotB = e.target;
			const bActive = 'plot-button--active'

			plotB.classList.toggle(bActive);

			if (plotB.classList.contains(bActive)) {
				plotP.style.maxHeight = plotP.scrollHeight + "px";
			} else {
				plotP.style.maxHeight = 0;
			}
		}

		return { error, list, ownership, handleDelete, handleClick, modalOn, showModal, hideModal, openPlotDesc }
	}
}
</script>

<style>
	.plot-container {
		width: 29%;
		margin-left: auto;
    	margin-right: 5px;
	}
	.imdb-info {
		display: flex;
		flex-direction: column;
		margin-left: 20px;
	}
	.imdb-info span {
		color: white;
		margin-bottom: 5px;
		font-weight: 300;
	}
	span strong {
		color: white;
	}
	.imdb-info a {
		color: #F5C518;
	}
	.imdb-info span:last-child {
		margin-bottom: 0;
	}
	.plot {
		color: white;
		font-style: italic;
		font-weight: 200;
		font-size: 18px;
	}
	.add-movie button {
		margin-top: 10px;
	}
	.list-details {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.cover {
		overflow: hidden;
		border-radius: 20px;
		position: relative;
		padding: 140px 180px;
	}
	.cover img {
		display: block;
		position: absolute;
		top: 0;
		left: 50%;
    	transform: translateX(-50%);
		min-width: 100%;
		min-height: 100%;
		max-width: 200%;
		max-height: 200%;
		opacity: 0.8;
	}
	.list-info {
		text-align: center;
		width: 60%;
		display: flex;
		justify-content: space-around;
		margin-bottom: 40px;
		align-items: center;
	}
	.list-desc {
		margin-left: 30px;
	}
	.movie-list {
		width: 100%;
		margin-bottom: 110px;
	}
	.list-info h2 {
		text-transform: capitalize;
		font-size: 28px;
		margin-top: 20px;
		color: rgb(226, 225, 225);
	}
	.list-info .username {
		color: rgb(204, 202, 202);
	}
	.list-info p {
		margin-bottom: 20px;
		color: rgb(226, 225, 225);
	}
	.description {
		text-align: center;
	}
	.single-movie {
		padding: 20px;
		display: flex;
		align-items: flex-start;
		margin-bottom: 20px;
		background: rgba(68, 68, 68, 0.9);
		border-radius: 15px;
		position: relative;
	}
	.single-movie button {
		position: absolute;
		right: 7px;
		bottom: 8px;
	}
	.video-img {
		border: 1px solid white;
		cursor: pointer;
		transition: 0.3s ease;
	}
	.video-img:hover {
		transform: scale(1.03);
		border-radius: 10px;
	}
	.video-player {
		width: 70vw;
    	height: 75vh;
	}
	.video-player-container {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.9);
		z-index: 10;
		visibility: hidden;
		opacity: 0;
		transition: 0.3s ease;
	}
	.video-player-container--active {
		visibility: visible;
		opacity: 1;
	}
	.plot-container .plot-button {
		display: none;
	}
	@media screen and (max-width: 1150px) {
		.plot {
			font-size: 16px;
		}
	}
	@media only screen and (max-width: 875px) {
		.imdb-info {
			margin-left: 0;
			margin-bottom: 15px;
		}
		.imdb-info span {
			font-size: 15px;
		}
		.plot {
			margin: 0;
			font-size: 16px;
			background: var(--primary);
			padding: 10px 12px 10px;
		}
		.plot-body {
			max-height: 0;
			overflow: hidden;
			transition: 0.4s ease;
		}
		.plot-container {
			border-radius: 20px;
    		border: 1px solid white;
			width: 100%;
			margin-right: 0;
			overflow: hidden;
		}
		.plot-container .plot-button {
			margin-top: 0;
			width: 100%;
			text-align: left;
			position: relative;
			right: 0;
			bottom: 0;
			display: block;
			border-radius: 0;
			background: var(--primary);
			color: var(--secondary);
		}
		.plot-button::after {
			content: "\002B";
			font-size: 16px;
			position: absolute;
			right: 12px;
			top: 50%;
			transform: translateY(-50%);
		}
		.plot-button--active::after {
			content: "\2212";
		}
		.video-player {
			    width: 92vw;
    			height: 45vh;
		}
		.list-details {
			flex-direction: column;
			align-items: center;
			padding-top: 10px;
		}
		.single-movie button {
			position: static;
			align-self: flex-end;
		}
		.list-info {
			margin-bottom: 20px;
			width: auto;
			flex-direction: column;
		}
		.cover {
			padding: 140px 160px;
		}
		.list-desc {
			margin-left: 0;
		}
		.video-img {
			margin-bottom: 10px;
			filter: grayscale(0);
			width: 100%;
		}
		.movie-list {
			width: 100%;
			margin-bottom: 0;
		}
		.single-movie {
			margin-bottom: 20px;
    		flex-direction: column;
		}
	}
	@media only screen and (max-width: 360px) {
		.cover {
			padding: 130px 140px;
		}
	}
</style>