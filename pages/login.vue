<template>
  <main class="min-h-screen bg-gray-800 flex-center">
    <div class="min-w-[500px] px-12 py-12 bg-white text-black rounded-3xl">
      <h1 class="text-4xl text-center">Login</h1>
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
        @click.prevent="submitForm()"
        type="submit"
        value="Submit"
        class="w-full px-2 py-4 mt-8 text-white bg-green-600 rounded-lg hover:bg-green-700"
      />
      <span v-if="credentials.errorMsg"> {{ credentials.errorMsg }}</span>
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
