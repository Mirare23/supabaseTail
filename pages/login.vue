<template>
  <main class="min-h-screen bg-gray-900 flex-center">
    <div class="max-w-[500px] px-12 py-12 bg-indigo-950 text-black rounded-3xl">
      <h1 class="text-4xl text-center text-white">Login</h1>
      <form @submit.prevent="submitForm()">
        <input
          v-model="credentials.email"
          type="email"
          placeholder="Emails"
          class="w-full px-2 py-2 mt-8 border border-gray-500 rounded-lg placeholder:text-gray-950 ring-0 ring-offset-0"
        />
        <span
          v-for="error in v$.email.$errors"
          :key="error.$uid"
          class="text-left text-red-700"
        >
          {{ error.$message }}
        </span>
        <input
          v-model="credentials.password"
          type="password"
          placeholder="Password"
          class="w-full px-2 py-2 mt-2 border border-gray-500 rounded-lg placeholder:text-gray-950 ring-0 ring-offset-0"
        />
        <span
          v-for="error in v$.password.$errors"
          :key="error.$uid"
          class="text-left text-red-700"
        >
          {{ error.$message }}
        </span>
        <input
          type="submit"
          value="Submit"
          class="w-full px-2 py-4 mt-8 text-white bg-indigo-400 rounded-lg hover:bg-opacity-80"
        />
        <span v-if="credentials.errorMsg" class="mt-4 text-center text-white">
          {{ credentials.errorMsg }}</span
        >
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
const client = useSupabaseClient()
import { useVuelidate } from "@vuelidate/core"
import { required, email } from "@vuelidate/validators"
import type { Input } from "~/types/credentials.types"

const credentials = ref<Input>({
  email: "",
  password: "",
  errorMsg: "",
})

const rulesCredentials = {
  email: { required, email },
  password: { required },
}

const v$ = useVuelidate(rulesCredentials, credentials)

const submitForm = async () => {
  const result = await v$.value.$validate()
  if (result) {
    try {
      const { error } = await client.auth.signInWithPassword({
        email: credentials.value.email,
        password: credentials.value.password,
      })
      if (error) throw error
      navigateTo("/")
    } catch (error: any) {
      credentials.value.errorMsg = error.message
    }
  } else {
    console.log("gagal")
  }
}
</script>

<style scoped></style>
