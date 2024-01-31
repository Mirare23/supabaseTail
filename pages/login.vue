<template>
  <main class="min-h-screen bg-center bg-cover bg-login-image flex-center">
    <section class="container grid grid-cols-2 min-h-[700px]">
      <div class="border-[10px] rounded-l-lg border-white">
        <div class="relative w-full h-full bg-transparent rounded-full">
          <h3 class="absolute text-sm text-white top-4 left-5">A WISE QUOTE</h3>
          <h3 class="absolute font-serif text-4xl text-white bottom-10 left-5">
            GET <br />
            EVERYTHING YOU <br />
            WANT
          </h3>
        </div>
      </div>
      <div class="flex flex-col items-center justify-between p-4 bg-white">
        <h1 class="text-2xl font-bold">Todo List</h1>
        <form @submit.prevent="submitForm()" class="flex flex-col gap-2">
          <h2 class="font-serif text-4xl font-semibold text-center">
            Welcome Back {{ user }}
          </h2>
          <p>Enter your email and password to access your account</p>
          <label for="Email" class="mt-8 font-medium">Email</label>
          <input
            v-model="credentials.email"
            type="text"
            class="w-full px-2 py-2 rounded-md bg-slate-100"
            placeholder="Enter your email"
          />
          <label for="Email" class="mt-4 font-medium">Password</label>
          <input
            v-model="credentials.password"
            type="password"
            class="w-full px-2 py-2 rounded-md bg-slate-100"
            placeholder="Enter your password"
          />
          <p v-if="credentials.errorMsg" class="mt-4 text-center text-red-700">
            {{ credentials.errorMsg }}
          </p>
          <input
            :disabled="loading"
            type="submit"
            value="Sign In"
            :class="{ 'opacity-40': loading }"
            class="w-full py-2 mt-5 text-white bg-black rounded-md"
          />
          <span
            @click.prevent="signInWithGithub()"
            class="flex items-center justify-center w-full gap-2 py-2 bg-white border border-black cursor-pointer"
            ><icon name="uil:github" size="28px" />Sign in with github</span
          >
        </form>
        <p>
          Dont have an account ?
          <NuxtLink to="/" class="font-bold">Signup</NuxtLink>
        </p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { Input } from "~/types/credentials.types"

const client = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(false)
const credentials = ref<Input>({
  email: "",
  password: "",
  errorMsg: "",
})

watchEffect(() => {
  if (user.value) {
    navigateTo("/")
  }
})

const submitForm = async () => {
  try {
    loading.value = true
    const { error } = await client.auth.signInWithPassword({
      email: credentials.value.email,
      password: credentials.value.password,
    })
    loading.value = false
    if (error) throw error
    navigateTo("/")
  } catch (error: any) {
    credentials.value.errorMsg = error.message
    loading.value = false
  }
}

const signInWithGithub = async () => {
  try {
    const { data, error } = await client.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/confirm",
      },
    })
    if (error) throw error
    console.log("berhasil")
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped></style>
