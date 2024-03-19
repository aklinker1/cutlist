import { defineOnshapeApi } from '~~/src/onshape';

export default createGlobalState(() =>
  defineOnshapeApi({
    // Forward requests through server
    baseUrl: '/api/onshape',
  }),
);
