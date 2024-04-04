import { defineOnshapeLoader } from '@aklinker1/cutlist/onshape';

export default createGlobalState(() =>
  defineOnshapeLoader({
    // Forward requests through server
    baseUrl: '/api/onshape',
    // Server adds auth, no need to pass anything here
    // auth: { ... },
  }),
);
