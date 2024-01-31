<script setup lang="ts">
const user = useSupabaseUser()

watchEffect(() => {
  if (user.value) {
    // Redirect to protected page
    return navigateTo("/")
  } else {
    return navigateTo("/login")
  }
})
</script>

<template>
  <div>Waiting for login...</div>
</template>
