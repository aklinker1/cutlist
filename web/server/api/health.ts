import { version } from '~~/package.json';

export default defineEventHandler(async (event) => {
  return {
    version,
  };
});
