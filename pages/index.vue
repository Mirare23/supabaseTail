<template>
  <h1>Confirm Page</h1>
  <button @click.prevent="logout()">Logout</button>
</template>

<script setup lang="ts">
const client = useSupabaseClient()

function logout() {
  client.auth.signOut()
}
</script>

<style scoped></style>
