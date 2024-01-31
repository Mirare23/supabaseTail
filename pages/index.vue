<template>
  <main class="flex flex-col items-center min-h-screen pt-40 bg-gray-900">
    <h1 class="text-5xl text-white">Todo List App</h1>
    <input
      type="text"
      class="px-2 py-4 mt-4 rounded-lg w-80"
      placeholder="Add todo Task"
      @keyup.enter="addToTask"
      v-model="inputTask"
      id=""
    />
    <ul class="flex flex-col gap-2 mt-10">
      <li
        v-for="(Task, index) in tasks"
        :key="Task.id"
        class="flex gap-4 px-2 py-4 text-white bg-indigo-600 w-80"
      >
        <input
          type="checkbox"
          v-model="Task.is_complete"
          :name="String(Task.id)"
          @change.prevent="completeTask(Task)"
        />
        <h3 :class="{ underline: Task.is_complete }">{{ Task.task }}</h3>
      </li>
    </ul>
  </main>
  <button @click.prevent="logout()">Logout</button>
</template>

<script setup lang="ts">
import type { Database } from "~/types/supabase"

definePageMeta({
  middleware: "auth",
})
const client = useSupabaseClient<Database>()
const user = useSupabaseUser()
const inputTask = ref<string>("")

// Logout
const logout = async () => {
  await client.auth.signOut()
  return navigateTo("/login")
}

const { data: tasks } = await useAsyncData("tasks", async () => {
  if (user.value) {
    const { data } = await client
      .from("todos")
      .select("id, task, is_complete,inserted_at")
      .eq("user_id", user.value.id)
      .order("inserted_at")

    return data
  }
})

const addToTask = async () => {
  if (user.value) {
    const { data, error } = await client
      .from("todos")
      .upsert({
        task: inputTask.value,
        user_id: user.value.id,
        is_complete: false,
      })
      .select("id, task, is_complete, inserted_at")
      .single()
    if (tasks.value && data) {
      tasks.value.push(data)
      inputTask.value = ""
    }
  }
}

const completeTask = async (event: taskInterface) => {
  await client
    .from("todos")
    .update({
      is_complete: event.is_complete,
    })
    .match({
      id: event.id,
    })
}
</script>

<style scoped></style>
