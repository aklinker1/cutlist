<script lang="ts" setup>
import { version } from '~~/package.json';

const createNewProject = useCreateNewProject();
</script>

<template>
  <div class="bg-gray-200 dark:bg-gray-800 h-full p-8 flex">
    <div class="w-full max-w-lg mx-auto flex flex-col gap-8">
      <div class="flex gap-2">
        <h1 class="flex-1 text-2xl font-medium line-clamp-1 truncate">
          Projects
        </h1>
        <UButton
          class="shrink-0"
          icon="i-heroicons-plus"
          @click="createNewProject"
          >Import</UButton
        >
      </div>
      <ClientOnly>
        <ProjectList>
          <li class="text-center pt-16 opacity-50">
            <ULink
              class="hover:underline"
              to="https://github.com/aklinker1/cutlist/tags"
              target="blank"
              >v{{ version }}</ULink
            >
            &ensp;&bull;&ensp;
            <ULink
              class="hover:underline"
              to="https://github.com/aklinker1/cutlist"
              target="blank"
              >GitHub</ULink
            >
            &ensp;&bull;&ensp;
            <ULink
              class="hover:underline"
              to="https://github.com/aklinker1/cutlist/wiki"
              target="blank"
              >User Manual</ULink
            >
          </li>
        </ProjectList>
      </ClientOnly>
    </div>
  </div>
</template>
