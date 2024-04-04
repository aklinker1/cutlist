import { defineOnshapeApi } from '@aklinker1/cutlist/onshape';

export default createGlobalState(() =>
  defineOnshapeApi({
    // Forward requests through server
    baseUrl: '/api/onshape',
  }),
);
