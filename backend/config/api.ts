export default ({ env }) => ({
  responses: {
    privateAttributes: ['_v', '__v', 'id', 'created_at', 'updated_at'],
  },
  rest: {
    defaultLimit: 25,
    maxLimit: 100,
    withCount: true,
  },
});
