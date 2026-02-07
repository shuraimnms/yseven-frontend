# ⚡ Global Settings - Quick Start

## 🎯 What You Need to Know

**Your website has ONE central place to update ALL settings!**

Go to: **`/admin/settings`** → Change anything → Click **"Save Changes"** → **DONE!**

All pages update **INSTANTLY** across the entire website! 🚀

---

## 📝 What Can You Update?

### Contact Info
- Support Email
- Support Phone  
- Office Address

### Social Media
- Facebook, Instagram, Twitter, YouTube URLs
- Social media handles (@username)

### Business Settings
- Tax Rate (%)
- Free Shipping Threshold (₹)
- Standard Shipping Rate (₹)
- Express Shipping Rate (₹)

### Content
- Contact Page Text
- Maintenance Mode (On/Off)

### Downloads
- Product Catalog URL
- Company Brochure URL
- Price List URL
- Certificates URL

---

## 🚀 How to Use in Code

```tsx
import { useGlobalSettings } from '@/hooks/useGlobalSettings';

function MyComponent() {
  const { 
    supportEmail,
    supportPhone,
    socialMedia,
    downloadLinks 
  } = useGlobalSettings();

  return (
    <div>
      <p>Email: {supportEmail}</p>
      <p>Phone: {supportPhone}</p>
      <a href={socialMedia.facebook}>Facebook</a>
      
      {downloadLinks.catalogUrl && (
        <a href={downloadLinks.catalogUrl}>Download Catalog</a>
      )}
    </div>
  );
}
```

---

## ✅ Already Working On These Pages

- ✅ Footer (email, phone, address, social links)
- ✅ Contact Page (all contact info)
- ✅ SEO/Meta Tags (site title, phone)
- ✅ Maintenance Mode
- ✅ Checkout (shipping rules, tax)

---

## 🎯 To Add Settings to a New Page

1. Import: `import { useGlobalSettings } from '@/hooks/useGlobalSettings';`
2. Use: `const { supportEmail } = useGlobalSettings();`
3. Display: `<p>{supportEmail}</p>`

**That's it!** Changes in admin panel update everywhere automatically!

---

## 🔧 Validation Rules

- ✅ Email must contain `@` and `.`
- ✅ URLs must start with `http://` or `https://`
- ✅ Tax rate: 0-100%
- ✅ Shipping rates: cannot be negative
- ✅ Empty download links = button hidden automatically

---

## 🎉 Test It Now!

1. Go to `/admin/settings`
2. Change support email
3. Click "Save Changes"
4. Open `/contact` in new tab
5. See new email instantly! ✨

**No page refresh needed!**
