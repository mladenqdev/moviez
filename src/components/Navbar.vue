<template>
  <div class="navbar">
	  <nav>
		  <router-link class="logo" :to="{ name: 'Home' }">
			<img src="@/assets/logo.png" alt="site logo">
			<h1>moviez</h1>
		  </router-link>
		  <div class="links">
			  <div class="links-container" v-if="user">
				  <router-link class="list-links" :to="{ name: 'CreateList'}">Add a Movie List</router-link>
				  <router-link class="list-links" :to="{ name: 'UserLists'}">My Lists</router-link>
				  <span>Howdy, {{ user.displayName }}</span>
				  <button @click="handleClick">Log out</button>
			  </div>
			  <div class="links-login" v-else>
				  <router-link class="btn" :to="{ name: 'Signup'}">Join now!</router-link>
			  	  <router-link class="btn" :to="{ name: 'Login'}">Log in</router-link>
			  </div>
		  </div>
	  </nav>
  </div>
</template>

<script>
import useLogout from '@/composables/useLogout'
import getUser from '@/composables/getUser'
import { useRouter } from 'vue-router'

export default {
	setup() {
		const { user } = getUser()
		const { logout } = useLogout()
		const router = useRouter()

		const stickyNav = () => {
			window.addEventListener('scroll', () => {
			const nav = document.querySelector('.navbar');
				if (window.scrollY > 50) {
					nav.classList.add('navbar-active')
				} else {
					nav.classList.remove('navbar-active')
				}
			})
		}

		stickyNav()

		const handleClick = async () => {
			await logout()
			// console.log('user logged out')
			router.push({ name: 'Login'})
		}

		return { handleClick, user, stickyNav }
	}
}
</script>

<style scoped>
	.logo {
		display: flex;
		align-items: center;
	}
	.navbar {
		padding: 16px 10px;
		background: linear-gradient(to left, #333, #333 50%, #eee 100%);
		opacity: 0.9;
		transition: 0.4s ease;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 5;

	}
	.navbar-active {
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
    	box-shadow: 0 -10px 11px 0 rgb(0 0 0 / 40%);
		z-index: 5;
	}
	nav {
		display: flex;
		align-items: center;
		max-width: 1200px;
		margin: 0 auto;
	}
	nav h1 {
		margin-left: 10px;
		color: white;
	}
	.list-links {
		color: white;
	}
	.links-container {
		display: flex;
    	align-items: center;
	}
	nav .links {
		margin-left: auto;
	}
	nav .links a, button {
		margin-left: 16px;
		font-size: 14px;
	}
	nav .links button {
		margin: 0 0 0 15px;
	}
	.list-links a {
		border: none;
	}
	nav .links button {
		color: black;
	}
	nav .links button:hover {
		color: white;
	}
	nav img {
		max-height: 60px;
	}
	span {
		font-size: 14px;
		display: inline-block;
		margin-left: 16px;
		padding-left: 16px;
		border-left: 1px solid #eee;
		color: white;
	}
	@media only screen and (max-width: 875px) {
		.logo {
			flex-direction: column;
		}
		.navbar {
			padding: 10px 10px 13px;
			bottom: auto;
			top: 0;
		}
		nav .links button {
			margin: 10px 0 0 0px;
		}
		.navbar-active {
			border-bottom-left-radius: 10px;
			border-bottom-right-radius: 10px;
			border-top-left-radius: 0;
			border-top-right-radius: 0;
			box-shadow: 0 10px 11px 0 rgb(0 0 0 / 40%);
			z-index: 5;
		}
		.links-container {
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			width: 100%;
		}
		span {
			margin-left: 0;
			padding-left: 0;
			border-left: none;
		}
		.links {
			margin-left: 0;
			width: 100%;
		}
		.links-login {
			display: flex;
    		justify-content: flex-end;
		}
		.links-container .list-links {
			text-align: center;
			margin-bottom: 4px;
			margin-left: 0;
		}
		.links-container button {
			margin-left: 0;
			margin-top: 12px;
			width: 100px;
		}
	}
</style>