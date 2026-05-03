<template>
  <form @submit.prevent="handleSubmit">
	  <h4>Add a New Movie List</h4>
	  <input type="text" required placeholder="List title" v-model="title">
	  <textarea required placeholder="List description..." v-model="description"></textarea>

	  <div class="error"></div>
	  <button v-if="!isPending">Add</button>
	  <button v-else disabled>Saving...</button>
  </form>
</template>

<script>
import { ref } from 'vue'
import useCollection from '@/composables/useCollection'
import getUser from '@/composables/getUser'
import { timestamp } from '@/firebase/config'
import { useRouter } from 'vue-router'

export default {
	setup() {
		const { error, addDoc } = useCollection('lists')
		const { user } = getUser()
		const router = useRouter()

		const title = ref('')
		const description = ref('')
		const isPending = ref(false)

		const handleSubmit = async () => {
			isPending.value = true
			const res = await addDoc({
				title: title.value,
				description: description.value,
				userId: user.value.uid,
				userName: user.value.displayName,
				movies: [],
				createdAt: timestamp()
			})
			isPending.value = false
			if (!error.value) {
				router.push({ name: 'ListDetails', params: { id: res.id}})
			}
		}

		return { title, description, handleSubmit, isPending }
	}
}
</script>

<style>
	input[type="file"] {
		border: 0;
		padding: 0;
	}
	label {
		font-size: 12px;
		display: block;
		margin-top: 30px;
	}
	button {
		margin-top: 20px;
	}
</style>