<template>
  <main
    class="flex relative flex-col items-center min-h-screen pt-40 bg-[#F9FAFC]"
  >
    <!-- modal -->
    <div
      v-if="modal"
      class="absolute inset-0 w-full h-full bg-white bg-opacity-50"
    >
      <div
        class="fixed flex flex-col p-10 -translate-x-1/2 bg-white shadow-xl top-56 left-1/2"
      >
        <icon
          name="uil:x"
          size="30px"
          class="flex self-end cursor-pointer"
          @click.prevent="modal = !modal"
        />
        <label for="" class="font-semibold">Add New Task</label>
        <input
          @keypress.enter="addToTask()"
          v-model="inputTask"
          type="text"
          class="px-2 py-2 mt-4 rounded-md bg-slate-100"
          placeholder="Input new task here"
        />
      </div>
    </div>
    <!-- end Modal -->
    <!-- Start Card Todo List -->
    <div
      class="px-5 py-10 overflow-hidden bg-white border shadow-2xl min-w-96 border-zinc-200"
    >
      <div class="flex items-center justify-between">
        <h1 class="text-2xl text-black">Todo List</h1>
        <button
          @click.prevent="modal = !modal"
          class="px-4 py-2 text-white rounded-lg bg-neutral-700"
        >
          Create a task
        </button>
      </div>
      <!-- List Looped -->
      <ul class="flex flex-col gap-2 mt-10">
        <li
          v-for="(Task, index) in tasks"
          :key="Task.id"
          :class="{ 'line-through': Task.is_complete }"
          class="flex items-center gap-8 px-4 border min-h-16"
        >
          <input
            v-model="Task.is_complete"
            type="checkbox"
            @change.prevent="completeTask(Task)"
          />
          {{ Task.task }}
        </li>
      </ul>
    </div>
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
const modal = ref(false)

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
      modal.value = false
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
