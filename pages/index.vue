<template>
  <h1>Confirm Page</h1>
  <button @click.prevent="logout()">Logout</button>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
})
const client = useSupabaseClient()

function logout() {
  client.auth.signOut()
  navigateTo("/login")
}
</script>

<style scoped></style>
