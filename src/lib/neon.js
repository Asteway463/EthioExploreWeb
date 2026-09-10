import { createClient } from '@neondatabase/neon-js';
import { BetterAuthReactAdapter } from '@neondatabase/neon-js/auth/react/adapters';

const neonAuthUrl =
  import.meta.env.VITE_NEON_AUTH_URL ||
  import.meta.env.AUTH_URL ||
  'https://ep-still-grass-ayso4pgc.neonauth.c-5.us-east-2.aws.neon.tech/neondb/auth';

export const neon = createClient({
  auth: {
    url: neonAuthUrl,
    adapter: BetterAuthReactAdapter(),
  },
});
