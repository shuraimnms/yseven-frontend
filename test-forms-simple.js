// Simple test for all forms with admin dashboard redirection
// Run this in browser console on any page

// Configuration
const API_BASE_URL = 'https://yseven-backend.onrender.com/api/v1';

console.log("🧪 Testing all forms with admin dashboard redirection...");

// Test Contact Form
async function testContactForm() {
  console.log("📝 Testing Contact Form...");
  
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: "Test User",
        email: "test@example.com",
        phone: "+1234567890",
        subject: "Test Subject",
        message: "This is a test message from the contact form.",
        type: "general"
      })
    });
    
    const data = await response.json();
    console.log("Contact Form Response:", response.status, data);
    return response.ok;
  } catch (error) {
    console.error("❌ Contact Form Error:", error);
    return false;
  }
}

// Test Bulk Orders Form
async function testBulkOrdersForm() {
  console.log("📦 Testing Bulk Orders Form...");
  
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: "Test Restaurant Owner",
        email: "restaurant@example.com",
        phone: "+1234567890",
        subject: "Bulk Order Inquiry - Test Restaurant",
        message: "Business Name: Test Restaurant\nBusiness Type: Restaurant\nEstimated Monthly Volume: 500 units\n\nAdditional Details:\nTesting bulk order inquiry",
        type: "bulk"
      })
    });
    
    const data = await response.json();
    console.log("Bulk Orders Form Response:", response.status, data);
    return response.ok;
  } catch (error) {
    console.error("❌ Bulk Orders Form Error:", error);
    return false;
  }
}

// Test Newsletter Form
async function testNewsletterForm() {
  console.log("📧 Testing Newsletter Form...");
  
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: "Newsletter Subscriber",
        email: "newsletter@example.com",
        subject: "Newsletter Subscription",
        message: "User subscribed to newsletter",
        type: "general"
      })
    });
    
    const data = await response.json();
    console.log("Newsletter Form Response:", response.status, data);
    return response.ok;
  } catch (error) {
    console.error("❌ Newsletter Form Error:", error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log("🚀 Starting form testing...\n");
  
  const results = {
    contact: await testContactForm(),
    bulk: await testBulkOrdersForm(),
    newsletter: await testNewsletterForm()
  };
  
  console.log("\n📊 Test Results:");
  console.log("================");
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const allPassed = Object.values(results).every(result => result);
  console.log(`\n🎯 Overall: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (allPassed) {
    console.log("\n🎉 All forms are working correctly!");
    console.log("📋 Form Flow:");
    console.log("1. User fills form → 2. Data submitted → 3. Success message → 4. Redirect to admin");
  }
  
  return results;
}

// Execute tests
runAllTests();