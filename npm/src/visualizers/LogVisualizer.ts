import type { Visualizer } from './Visualizer';

export function defineLogVisualizer(): Visualizer {
  return {
    async render(description, options) {
      console.log(description, options);
    },
  };
}
