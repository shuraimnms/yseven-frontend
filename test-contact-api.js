// Test script for Contact API validation
// Run this in browser console on the frontend

// Configuration
const API_BASE_URL = 'https://yseven-backend.onrender.com/api/v1';

// Test 1: Valid export request (matches current backend schema)
fetch(`${API_BASE_URL}/contact`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fullName: "Shuraim Test",                    // required: min 2 chars
    email: "shuraim@example.com",               // required: valid email
    phone: "+1234567890",                       // optional: valid format
    subject: "Export Quote Request - Test Company", // required: min 5 chars
    message: "Hello, I'd like more info about your export services.", // required: min 10 chars
    type: "export"                              // required: enum value
  })
})
.then(response => {
  console.log('Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ Test 1 - Valid export request:', data);
})
.catch(error => {
  console.error('❌ Test 1 failed:', error);
});

// Test 2: Test without phone (should work with our fix)
fetch(`${API_BASE_URL}/contact`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fullName: "Test User No Phone",
    email: "nophone@example.com",
    // phone: undefined,  // No phone field
    subject: "Contact without phone",
    message: "This is a test message without phone number.",
    type: "general"
  })
})
.then(response => {
  console.log('Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ Test 2 - No phone field:', data);
})
.catch(error => {
  console.error('❌ Test 2 failed:', error);
});

// Test 3: Test with empty phone string (should work with our fix)
fetch(`${API_BASE_URL}/contact`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fullName: "Test User Empty Phone",
    email: "emptyphone@example.com",
    phone: "",  // Empty string
    subject: "Contact with empty phone",
    message: "This is a test message with empty phone string.",
    type: "general"
  })
})
.then(response => {
  console.log('Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ Test 3 - Empty phone string:', data);
})
.catch(error => {
  console.error('❌ Test 3 failed:', error);
});

// Test 4: Test validation errors (should fail gracefully)
fetch(`${API_BASE_URL}/contact`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fullName: "A",  // Too short
    email: "invalid-email",  // Invalid format
    phone: "123",  // Invalid format
    subject: "Hi",  // Too short
    message: "Short",  // Too short
    type: "invalid"  // Invalid enum
  })
})
.then(response => {
  console.log('Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ Test 4 - Validation errors (expected to fail):', data);
})
.catch(error => {
  console.error('❌ Test 4 failed:', error);
});

console.log('🧪 Running Contact API tests...');