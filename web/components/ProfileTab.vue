<script lang="ts" setup>
const currentUser = useCurrentUser();
</script>

<template>
  <TabListItem to="/account" hide-close>
    <span v-if="!currentUser" class="text-sm">Sign In</span>
    <UIcon name="i-heroicons-user-circle" class="size-6" />
  </TabListItem>
</template>
