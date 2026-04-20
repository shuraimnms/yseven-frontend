/**
 * Creates the admin user in Supabase Auth + sets role in profiles table.
 *
 * Run:  npx tsx supabase/create-admin.ts
 *
 * Requires env vars (in .env or set in shell):
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   ← from Supabase → Settings → API → service_role
 */
/// <reference types="node" />
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('\n❌  Missing env vars.');
  console.error('   VITE_SUPABASE_URL     =', SUPABASE_URL || '(empty)');
  console.error('   SUPABASE_SERVICE_ROLE_KEY =', SERVICE_KEY ? '(set)' : '(empty)');
  console.error('\nGet the service_role key from:');
  console.error('  Supabase Dashboard → Settings → API → service_role secret\n');
  process.exit(1);
}

// Use service role client — bypasses RLS
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ADMIN_EMAIL    = 'admin@y7foods.com';
const ADMIN_PASSWORD = 'Admin@123456';
const ADMIN_NAME     = 'Y7 Admin';

async function run() {
  console.log('\n🔧  Y7 Admin User Setup');
  console.log('========================');
  console.log(`   Supabase: ${SUPABASE_URL}`);
  console.log(`   Email:    ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}\n`);

  // ── 1. Check if user already exists ──────────────────────────
  const { data: existing } = await supabase.auth.admin.listUsers();
  const existingUser = existing?.users?.find(u => u.email === ADMIN_EMAIL);

  let userId: string;

  if (existingUser) {
    console.log('ℹ️   User already exists in Auth — updating password...');
    const { error } = await supabase.auth.admin.updateUserById(existingUser.id, {
      password: ADMIN_PASSWORD,
      email_confirm: true,
      app_metadata: { role: 'admin' },   // ← embedded in JWT
    });
    if (error) { console.error('❌  Update failed:', error.message); process.exit(1); }
    userId = existingUser.id;
    console.log('✅  Password updated.');
  } else {
    // ── 2. Create user ──────────────────────────────────────────
    console.log('➕  Creating user in Supabase Auth...');
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { name: ADMIN_NAME },
      app_metadata: { role: 'admin' },   // ← embedded in JWT
    });
    if (error || !data.user) {
      console.error('❌  Create failed:', error?.message);
      process.exit(1);
    }
    userId = data.user!.id;
    console.log('✅  User created. ID:', userId);
  }

  // ── 3. Upsert profile with admin role ─────────────────────────
  console.log('🔑  Setting role = admin in profiles table...');
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ id: userId, name: ADMIN_NAME, role: 'admin' }, { onConflict: 'id' });

  if (profileError) {
    console.error('❌  Profile upsert failed:', profileError.message);
    console.error('   Make sure you ran supabase/schema.sql first!');
    process.exit(1);
  }

  console.log('✅  Profile set to admin.\n');
  console.log('🎉  Done! Login credentials:');
  console.log('   URL:      /auth/login');
  console.log(`   Email:    ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log('\n   After login you will be redirected to /admin\n');
}

run();
