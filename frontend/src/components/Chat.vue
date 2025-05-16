<script setup>
import { ref, onMounted } from 'vue';
import { io } from 'socket.io-client';

import { useShatStore } from '@/stores/chat.js';
const chatStore = useShatStore();
console.log(chatStore.rooms);

onMounted(() => {
  const socket = io('http://localhost:3000');
});
</script>

<template>
  <div class="p-3 flex items-center justify-center w-full h-full bg-emerald-200">
    <!--    main-->
    <div class="w-200 rounded-xl h-100 bg-stone-200 overflow-hidden flex flex-col">
      <!--    top-->
      <div class="h-6 w-full text-center bg-[#f4f4f4]">chat</div>

      <div class="flex h-full">
        <!--    sidebar-->
        <div class="bg-white w-60 border-r-1">
          <p class="text-center py-2">
            Chats
            <span class="p-2 text-center ml-3 text-blue-500 cursor-pointer">
              <i class="pi pi-pen-to-square"></i>
            </span>
          </p>
          <div class="p-1 bg-stone-200 mx-1 rounded-lg mb-1 text-center text-stone-500 text-sm">
            <i class="pi pi-search"></i>
            <span class="pl-2">Search</span>
          </div>
          <div class="border-t-1 p-y-1">
            <ul>
              <li
                v-for="item in chatStore.rooms"
                :key="item.id"
                @click="chatStore.setActiveRoom(item.value)"
                class="flex items-center p-1 border-b-1 border-black cursor-pointer hover:bg-[#4c91c7]"
                :class="{ 'bg-[#4c91c7] text-white': item.active }"
              >
                <span
                  class="w-10 h-10 rounded-[50%] bg-stone-400 text-xs mr-3 flex items-center justify-center"
                  >item</span
                >
                {{ item.value }}
              </li>
            </ul>
          </div>
        </div>
        <!--    chat window-->
        <div class="bg-white w-140 relative">
          <!--    selected chat-->
          <div class="border-b-1 p-1">
            <div class="flex items-center p-1">
              <span
                class="w-7 h-7 rounded-[50%] bg-stone-400 text-xs mr-3 flex items-center justify-center"
                >icon</span
              >
              {{ chatStore.selectedRoom }}
            </div>
          </div>
          <!--  messeging chat-->
          <div class="bg-lime-700/50 h-[291px] overflow-auto p-1 text-white">
            <ul>
              <li>message 1</li>
              <li>message 1</li>
            </ul>
          </div>
          <!--  form-->
          <div class="absolute w-full bg-white right-0 bottom-0 h-10">
            <form action="" class="w-full h-full">
              <input
                class="h-full w-[80%] p-1 focus:outline-1"
                type="text"
                placeholder="type text"
              />
              <div class="inline-block">
                <span class="p-2 text-1xl cursor-pointer text-stone-500">
                  <i class="pi pi-face-smile"></i
                ></span>
                <button type="submit" class="text-blue-500 font-bold cursor-pointer ml-3">
                  <i class="pi pi-send text-1xl"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!--    main-->
  </div>
</template>

<style scoped></style>
