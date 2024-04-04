<script lang="ts" setup>
import { StockMatrix } from '@aklinker1/cutlist';
import { z } from 'zod';
import YAML from 'js-yaml';

const model = defineModel<StockMatrix>();

const getModelString = () =>
  YAML.dump(model.value, { indent: 2, flowLevel: 2 });

const text = ref(getModelString());

const textModel = computed<string>({
  get() {
    return text.value;
  },
  set(value) {
    try {
      text.value = value;
      model.value = z.array(StockMatrix).parse(YAML.load(value));
      error.value = undefined;
    } catch (err) {
      error.value = err;
    }
  },
});

const error = ref<unknown>();
</script>

<template>
  <div class="absolute inset-0 flex flex-col p-4 overlfow-auto gap-4">
    <textarea
      v-model="textModel"
      class="font-mono flex-1 resize-none bg-gray-900 border border-gray-700 p-4 outline-none rounded-lg whitespace-pre"
    />
    <div
      v-if="error"
      class="bg-red-900 shrink-0 p-4 rounded-lg border border-red-600"
    >
      <p class="text-white whitespace-pre-wrap">
        {{ error }}
      </p>
    </div>
  </div>
</template>
