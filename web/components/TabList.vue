<template>
  <ul class="flex overflow-x-auto bg-gray-100 dark:bg-gray-900 print:hidden">
    <slot />
  </ul>
</template>

<style scoped>
ul {
  scrollbar-width: none;
}
</style>
