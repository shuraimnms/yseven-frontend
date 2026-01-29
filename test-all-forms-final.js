// Final comprehensive test for all forms connected to backend
// Run this in browser console or Node.js

// Configuration
const API_BASE_URL = 'https://yseven-backend.onrender.com/api/v1';

console.log("🧪 Final Test: All Forms Connected to Backend");
console.log("==============================================");

// Test all form types
async function testAllForms() {
  const forms = [
    {
      name: "Contact Form",
      icon: "📝",
      data: {
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
        subject: "General Inquiry",
        message: "This is a test message from the contact form.",
        type: "general"
      }
    },
    {
      name: "Bulk Orders Form",
      icon: "📦",
      data: {
        fullName: "Restaurant Manager",
        email: "manager@restaurant.com",
        phone: "1234567890",
        subject: "Bulk Order Inquiry - Test Restaurant",
        message: "Business Name: Test Restaurant\nBusiness Type: Restaurant\nEstimated Monthly Volume: 500 units\n\nAdditional Details:\nTesting bulk order inquiry",
        type: "bulk"
      }
    },
    {
      name: "Export Form",
      icon: "🌍",
      data: {
        fullName: "Export Manager",
        email: "export@company.com",
        phone: "1234567890",
        subject: "Export Quote Request - Test Company",
        message: "Company Name: Test Export Co.\nCountry: United States\nProduct Interest: Sauces\nEstimated Volume: 1000 units\n\nAdditional Details:\nTesting export form functionality",
        type: "export"
      }
    },
    {
      name: "Newsletter Form",
      icon: "📧",
      data: {
        fullName: "Newsletter Subscriber",
        email: "newsletter@example.com",
        subject: "Newsletter Subscription",
        message: "User subscribed to newsletter",
        type: "general"
      }
    },
    {
      name: "ChatBot Lead Form",
      icon: "💬",
      data: {
        fullName: "Chat User",
        email: "chat@example.com",
        phone: "1234567890",
        subject: "Business Inquiry from ChatBot",
        message: "User inquiry from chatbot: Looking for bulk sauce orders for my restaurant chain.",
        type: "chat"
      }
    }
  ];

  const results = [];
  
  for (const form of forms) {
    console.log(`\n${form.icon} Testing ${form.name}...`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.data)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${form.name}: SUCCESS`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Message: ${data.message}`);
        results.push({ name: form.name, success: true, status: response.status });
      } else {
        console.log(`❌ ${form.name}: FAILED`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Error: ${data.message || 'Unknown error'}`);
        results.push({ name: form.name, success: false, status: response.status, error: data.message });
      }
    } catch (error) {
      console.log(`❌ ${form.name}: ERROR`);
      console.log(`   Error: ${error.message}`);
      results.push({ name: form.name, success: false, error: error.message });
    }
    
    // Add delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 FINAL TEST RESULTS");
  console.log("=".repeat(50));
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  results.forEach(result => {
    const status = result.success ? '✅ PASSED' : '❌ FAILED';
    console.log(`${status} - ${result.name}`);
    if (!result.success && result.error) {
      console.log(`    Error: ${result.error}`);
    }
  });
  
  console.log("\n" + "=".repeat(50));
  console.log(`🎯 OVERALL: ${successful}/${total} forms working correctly`);
  
  if (successful === total) {
    console.log("🎉 ALL FORMS ARE WORKING PERFECTLY!");
    console.log("✨ Backend integration is complete and functional.");
  } else {
    console.log("⚠️  Some forms need attention. Check the errors above.");
  }
  
  return results;
}

// Run the test
testAllForms().catch(console.error);