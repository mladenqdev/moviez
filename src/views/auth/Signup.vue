<template>
  <form @submit.prevent="handleSubmit">
	  <h3>Join. do it now. do it.</h3>
	  <input type="text" placeholder="Display name" v-model="displayName" required>
	  <input type="email" placeholder="Email" v-model="email">
	  <input type="password" placeholder="Password" v-model="password">
	  <div v-if="error" class="error">{{ error }}</div>
	  <button v-if="!isPending">Join</button>
	  <button v-if="isPending" disabled>Loading</button>
  </form>
</template>

<script>
import useSignup from '@/composables/useSignup'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
	setup() {
		const { error, signup, isPending } = useSignup()
		const router = useRouter()

		const email = ref('')
		const password = ref('')
		const displayName = ref('')

		const handleSubmit = async () => {
			const res = await signup(email.value, password.value, displayName.value)
			if (!error.value) {
				router.push({ name: 'Home' })
			}
		}

		return { email, password, displayName, isPending, error, handleSubmit}
	}
}
</script>

<style>

</style>