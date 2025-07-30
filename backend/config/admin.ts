export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'default-admin-secret'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'default-api-token-salt'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'default-transfer-token-salt'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY', 'default-encryption-key'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  // Configuration pour résoudre les problèmes de contexte React
  autoReload: true,
  watchIgnoreFiles: [
    '**/node_modules/**',
    '**/.git/**',
    '**/dist/**',
  ],
});
