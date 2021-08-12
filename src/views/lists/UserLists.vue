<template>
  <div class="user-lists">
	  <h2>My Lists</h2>
	  <div v-if="lists">
		  <ListView :lists="lists" />
	  </div>
	  <router-link :to="{ name: 'CreateList' }" class="btn">Add a New List</router-link>
  </div>
</template>

<script>
import getUser from '@/composables/getUser'
import getCollection from '@/composables/getCollection'
import ListView from '@/components/ListView.vue'

export default {
	components: { ListView },
	setup() {
		const { user } = getUser()
		const { documents: lists } = getCollection(
			'lists',
			['userId', '==', user.value.uid ]
		)

		console.log(lists)

		return { lists }
	}
}
</script>

<style>
	.user-lists {
		padding-bottom: 20px;
	}
	.user-lists h2 {
		color: white;
	}
</style>