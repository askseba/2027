// test-auth.ts — شغّل: npx tsx test-auth.ts
// Tests environment variables and configuration

function testAuth() {
  console.log('🧪 Testing Ask Seba Auth Configuration...\n');
  
  // Note: Next.js automatically loads .env.local when running `npm run dev`
  // This script checks if variables would be available
  
  // Test: Environment variables check
  console.log('📋 Checking environment variables...\n');
  const hasSecret = !!process.env.NEXTAUTH_SECRET;
  const hasUrl = !!process.env.NEXTAUTH_URL;
  const hasGoogleId = !!process.env.GOOGLE_CLIENT_ID;
  const hasGoogleSecret = !!process.env.GOOGLE_CLIENT_SECRET;
  
  console.log(hasSecret ? '✅ NEXTAUTH_SECRET: Set' : '❌ NEXTAUTH_SECRET: Missing');
  console.log(hasUrl ? `✅ NEXTAUTH_URL: ${process.env.NEXTAUTH_URL}` : '❌ NEXTAUTH_URL: Missing');
  console.log(hasGoogleId ? `✅ GOOGLE_CLIENT_ID: Set (${process.env.GOOGLE_CLIENT_ID?.substring(0, 20)}...)` : '⚠️  GOOGLE_CLIENT_ID: Not set (optional for demo)');
  console.log(hasGoogleSecret ? '✅ GOOGLE_CLIENT_SECRET: Set' : '⚠️  GOOGLE_CLIENT_SECRET: Not set (optional for demo)');
  
  // Test: Configuration validation
  console.log('\n📊 Configuration Summary:');
  if (hasSecret && hasUrl) {
    console.log('✅ Core auth configuration is valid');
    console.log('✅ Demo credentials available: demo@askseba.com / 123456');
    if (!hasGoogleId || !hasGoogleSecret) {
      console.log('⚠️  Google OAuth not configured (optional for demo)');
      console.log('   → You can still use email/password login');
    } else {
      console.log('✅ Google OAuth is configured');
    }
    console.log('\n🚀 Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Visit: http://localhost:3000/login');
    console.log('   3. Use demo credentials or Google OAuth');
  } else {
    console.log('❌ Missing required environment variables');
    console.log('   Please create/check your .env.local file');
    console.log('\n📝 Required .env.local content:');
    console.log('   NEXTAUTH_SECRET=Z6r9pQvKxM2nL8wT4yU0jH5fB3cN7eR1oS9gA2dF6hJ');
    console.log('   NEXTAUTH_URL=http://localhost:3000');
    console.log('   GOOGLE_CLIENT_ID=');
    console.log('   GOOGLE_CLIENT_SECRET=');
  }
  
  console.log('\n💡 Note: Next.js automatically loads .env.local when running `npm run dev`');
}

testAuth();
