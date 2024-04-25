<script lang="ts" setup>
const props = defineProps<{
  url: string;
}>();

const { data: doc } = useDocumentQuery(() => props.url);
</script>

<template>
  <div v-if="doc" class="flex-1 page-break-after">
    <h1 class="text-lg font-medium">{{ doc.name }}</h1>
    <p class="text-sm opacity-50">
      by {{ doc.owner.name }} &bull;
      <ULink
        class="hover:underline inline-flex gap-1 items-center"
        :to="url"
        target="blank"
        title="Open in Onshape"
      >
        <span>{{ doc.defaultWorkspace.name }} Revision</span>
        <UIcon
          name="i-heroicons-arrow-top-right-on-square-16-solid"
          class="size-4"
        />
      </ULink>
    </p>
    <a
      class="text-sm opacity-50 hidden print:block"
      :href="url"
      target="_blank"
      >{{ url }}</a
    >
  </div>
</template>
