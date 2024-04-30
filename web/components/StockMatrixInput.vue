<script lang="ts" setup>
import { reduceStockMatrix } from '@aklinker1/cutlist';

const value = defineModel<string>({ required: true });

const internalValue = ref(value.value);
onMounted(() => {
  internalValue.value = value.value;
});

const parseStock = useParseStock();
const err = ref<unknown>();
watchThrottled(
  internalValue,
  (internalValue) => {
    try {
      console.log(1);
      const stock = reduceStockMatrix(parseStock(internalValue));
      console.log(2, stock);
      value.value = internalValue;
      err.value = undefined;
    } catch (error) {
      err.value = error;
      console.error(error);
    }
  },
  {
    throttle: 500,
    leading: false,
    trailing: true,
  },
);
</script>

<template>
  <textarea
    v-model="internalValue"
    class="font-mono flex-1 resize-none bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-4 outline-none rounded-lg whitespace-pre"
  />
  <div
    v-if="err"
    class="bg-red-900 shrink-0 p-4 rounded-lg border border-red-600"
  >
    <p class="text-white whitespace-pre-wrap">
      {{ err }}
    </p>
  </div>
</template>
