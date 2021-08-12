<template>
  <form @submit.prevent="handleSubmit">
	  <h4>Add a New Movie List</h4>
	  <input type="text" required placeholder="List title" v-model="title">
	  <textarea required placeholder="List description..." v-model="description"></textarea>
	  <!-- upload list image -->
	  <label>Upload list cover image</label>
	  <input type="file" @change="handleChange" required>
	  <div class="error">{{ fileError }}</div>

	  <div class="error"></div>
	  <button v-if="!isPending">Add</button>
	  <button v-else disabled>Saving...</button>
  </form>
</template>

<script>
import { ref } from 'vue'
import useStorage from '@/composables/useStorage'
import useCollection from '@/composables/useCollection'
import getUser from '@/composables/getUser'
import { timestamp } from '@/firebase/config'
import { useRouter } from 'vue-router'

export default {
	setup() {
		const { filePath, url, uploadImage } = useStorage()
		const { error, addDoc } = useCollection('lists')
		const { user } = getUser()
		const router = useRouter()

		const title = ref('')
		const description = ref('')
		const file = ref(null)
		const fileError = ref(null)
		const isPending = ref(false)

		const handleSubmit = async () => {
			if (file.value) {
				isPending.value = true
				await uploadImage(file.value)
				const res = await addDoc({
					title: title.value,
					description: description.value,
					userId: user.value.uid,
					userName: user.value.displayName,
					coverUrl: url.value,
					filePath: filePath.value,
					movies: [],
					createdAt: timestamp()
				})
				isPending.value = false
				if (!error.value) {
					router.push({ name: 'ListDetails', params: { id: res.id}})
				}
			}
		}

		// allowed file types
		const types = ['image/png', 'image/jpeg']

		const handleChange = (e) => {
			const selected = e.target.files[0]
			console.log(selected)

			if (selected && types.includes(selected.type)) {
				file.value = selected
				fileError.value = null
			} else {
				file.value = null
				fileError.value = 'Please select an image file (png or jpg)'
			}
		}

		return { title, description, handleSubmit, handleChange, fileError, isPending }
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