# Global Settings System - Complete Guide

## 🎯 Overview

Your website has a **centralized settings system** that allows you to update ANY setting from the Admin Settings page, and it will **automatically update across the ENTIRE website** in real-time!

## ✅ What's Already Working

The system is **fully functional** and includes:

1. **Global Settings Store** (`src/store/settingsStore.ts`)
   - Centralized state management using Zustand
   - Persistent storage (survives page refreshes)
   - Auto-refresh every 5 minutes

2. **Settings Provider** (`src/components/providers/SettingsProvider.tsx`)
   - Wraps entire app in `App.tsx`
   - Listens for updates from admin panel
   - Syncs across multiple browser tabs

3. **Global Settings Hook** (`src/hooks/useGlobalSettings.ts`)
   - Easy-to-use hook for any component
   - Automatic fallback values
   - Type-safe access to all settings

## 📝 Available Settings

All these settings can be updated from `/admin/settings`:

### Basic Information
- `siteTitle` - Website title
- `supportEmail` - Support email address
- `supportPhone` - Support phone number
- `officeAddress` - Office address

### Social Media
- `socialMedia.facebook` - Facebook URL
- `socialMedia.instagram` - Instagram URL
- `socialMedia.twitter` - Twitter URL
- `socialMedia.youtube` - YouTube URL

### Social Media Handles
- `socialMediaHandles.facebook` - Facebook username
- `socialMediaHandles.instagram` - Instagram username
- `socialMediaHandles.twitter` - Twitter username
- `socialMediaHandles.youtube` - YouTube username

### Business Rules
- `taxRate` - Tax percentage (0-100)
- `shippingRules.freeShippingThreshold` - Free shipping minimum amount
- `shippingRules.standardShippingRate` - Standard shipping cost
- `shippingRules.expressShippingRate` - Express shipping cost

### Content
- `contactPageContent` - Contact page description text
- `maintenanceMode` - Enable/disable maintenance mode

### Download Links
- `downloadLinks.catalogUrl` - Product catalog download link
- `downloadLinks.brochureUrl` - Company brochure download link
- `downloadLinks.priceListUrl` - Price list download link
- `downloadLinks.certificatesUrl` - Certificates download link

## 🚀 How to Use in Any Component

### Example 1: Basic Usage

```tsx
import { useGlobalSettings } from '@/hooks/useGlobalSettings';

function MyComponent() {
  const { supportEmail, supportPhone, siteTitle } = useGlobalSettings();

  return (
    <div>
      <h1>{siteTitle}</h1>
      <p>Email: {supportEmail}</p>
      <p>Phone: {supportPhone}</p>
    </div>
  );
}
```

### Example 2: Social Media Links

```tsx
import { useGlobalSettings } from '@/hooks/useGlobalSettings';

function SocialLinks() {
  const { socialMedia } = useGlobalSettings();

  return (
    <div>
      <a href={socialMedia.facebook}>Facebook</a>
      <a href={socialMedia.instagram}>Instagram</a>
      <a href={socialMedia.twitter}>Twitter</a>
      <a href={socialMedia.youtube}>YouTube</a>
    </div>
  );
}
```

### Example 3: Download Links (Conditional Display)

```tsx
import { useGlobalSettings } from '@/hooks/useGlobalSettings';

function DownloadSection() {
  const { downloadLinks } = useGlobalSettings();

  return (
    <div>
      {downloadLinks.catalogUrl && (
        <a href={downloadLinks.catalogUrl} download>
          Download Catalog
        </a>
      )}
      {downloadLinks.brochureUrl && (
        <a href={downloadLinks.brochureUrl} download>
          Download Brochure
        </a>
      )}
    </div>
  );
}
```

### Example 4: Shipping Rules

```tsx
import { useGlobalSettings } from '@/hooks/useGlobalSettings';

function CheckoutSummary({ subtotal }: { subtotal: number }) {
  const { shippingRules, taxRate } = useGlobalSettings();

  const shippingCost = subtotal >= shippingRules.freeShippingThreshold 
    ? 0 
    : shippingRules.standardShippingRate;

  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + shippingCost + tax;

  return (
    <div>
      <p>Subtotal: ₹{subtotal}</p>
      <p>Shipping: {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</p>
      <p>Tax ({taxRate}%): ₹{tax}</p>
      <p>Total: ₹{total}</p>
    </div>
  );
}
```

## 🔄 How Updates Work

### When Admin Saves Settings:

1. **Admin clicks "Save Changes"** in `/admin/settings`
2. Settings are validated (email format, URLs, etc.)
3. Settings are saved to database via API
4. **Global store is updated immediately**
5. **Custom event is dispatched** to all components
6. **localStorage is updated** to sync across tabs
7. **All components re-render** with new values
8. **Success toast notification** appears

### Real-Time Updates:

- ✅ **Same Tab**: Instant update via custom event
- ✅ **Other Tabs**: Instant update via localStorage sync
- ✅ **After Refresh**: Persisted via Zustand storage
- ✅ **New Visitors**: Fetched from API on load

## 📍 Where Settings Are Used

Your settings are already being used in:

1. **Footer** (`src/components/layout/Footer.tsx`)
   - Email, phone, address
   - Social media links

2. **Contact Page** (`src/pages/Contact.tsx`)
   - Contact information
   - Office address
   - Contact page content

3. **SEO Component** (`src/components/SEO.tsx`)
   - Site title
   - Phone number for structured data

4. **Maintenance Mode** (`src/components/MaintenanceMode.tsx`)
   - Maintenance mode toggle
   - Support email

## 🎨 Adding Settings to New Components

To use settings in any new component:

```tsx
// 1. Import the hook
import { useGlobalSettings } from '@/hooks/useGlobalSettings';

// 2. Use it in your component
function NewComponent() {
  // Get all settings
  const settings = useGlobalSettings();
  
  // Or destructure only what you need
  const { siteTitle, supportEmail } = useGlobalSettings();
  
  return (
    <div>
      <h1>{siteTitle}</h1>
      <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
    </div>
  );
}
```

## 🔧 Backend API Endpoints

### Public Settings (No Auth Required)
```
GET /api/v1/settings/public
```
Returns all public-facing settings (excludes sensitive data)

### Admin Settings (Auth Required)
```
GET /api/v1/admin/settings
PUT /api/v1/admin/settings
```
Full CRUD access to all settings

## 🎯 Testing the System

1. **Open Admin Settings**: Go to `/admin/settings`
2. **Change any setting**: e.g., change support email
3. **Click "Save Changes"**
4. **Open another tab**: Go to `/contact` page
5. **Verify**: New email appears immediately!

## 🐛 Troubleshooting

### Settings not updating?

1. **Check browser console** for errors
2. **Verify API is running** (backend must be online)
3. **Clear localStorage**: `localStorage.clear()` in console
4. **Hard refresh**: Ctrl+Shift+R

### Validation errors?

- Email must be valid format: `user@domain.com`
- URLs must start with `http://` or `https://`
- Tax rate must be 0-100
- Shipping rates cannot be negative

## 🎉 Summary

**You have a fully functional centralized settings system!**

- ✅ Update once in admin panel
- ✅ Changes appear everywhere instantly
- ✅ Works across multiple tabs
- ✅ Persists after refresh
- ✅ Easy to use in any component
- ✅ Type-safe with TypeScript
- ✅ Automatic fallback values

**Just use `useGlobalSettings()` in any component and you're done!**
