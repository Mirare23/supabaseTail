<template>
  <main class="flex-col min-h-screen bg-gray-900 flex-center">
    <h1 class="text-5xl text-white">Todo List App</h1>
    <input
      type="text"
      class="px-2 py-4 mt-4 rounded-lg w-80"
      placeholder="Add todo Task"
      @keyup.enter="addToTask"
      v-model="inputTask"
      id=""
    />
    <ul>
      <li
        v-for="(Task, index) in TaskList"
        :key="Task.task + index"
        class="text-white"
      >
        {{ Task.task }} - {{ Task.completed }}
      </li>
    </ul>
  </main>
  <button @click.prevent="logout()">Logout</button>
</template>

<script setup lang="ts">
import type { Tasklist } from "~/types/credentials.types"

definePageMeta({
  middleware: "auth",
})
const client = useSupabaseClient()
const inputTask = ref<string>("")
const TaskList = ref<Tasklist[]>([])

// Logout
function logout() {
  client.auth.signOut()
  navigateTo("/login")
}

const addToTask = () => {
  TaskList.value.push({
    task: inputTask.value,
    completed: false,
  })
  inputTask.value = ""
}
</script>

<style scoped></style>
