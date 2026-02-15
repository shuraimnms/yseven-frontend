import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  Globe,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Percent,
  Truck,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  Download,
  FileText,
  Link as LinkIcon,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';
import { generateSEO } from '@/lib/seo';
import { getApiBaseUrl } from '@/lib/api';
import Cookies from 'js-cookie';
import { validateSettings, ValidationError } from '@/utils/settingsValidation';
import { useSettingsStore } from '@/store/settingsStore';

interface SiteSettings {
  siteTitle: string;
  supportEmail: string;
  supportPhone: string;
  officeAddress: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
  socialMediaHandles: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
  taxRate: number;
  shippingRules: {
    freeShippingThreshold: number;
    standardShippingRate: number;
    expressShippingRate: number;
  };
  maintenanceMode: boolean;
  contactPageContent: string;
  downloadLinks: {
    catalogUrl: string;
    brochureUrl: string;
    priceListUrl: string;
    certificatesUrl: string;
  };
}

const SettingsPage = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    siteTitle: 'Y7 Sauces',
    supportEmail: 'ysevenfoods@gmail.com',
    supportPhone: '+91 9876543210',
    officeAddress: 'Y7 Sauces Pvt Ltd, Bangalore, Karnataka, India',
    socialMedia: {
      facebook: 'https://facebook.com/y7sauces',
      instagram: 'https://instagram.com/y7sauces',
      twitter: 'https://twitter.com/y7sauces',
      youtube: 'https://youtube.com/@y7sauces'
    },
    socialMediaHandles: {
      facebook: 'y7sauces',
      instagram: 'y7sauces',
      twitter: 'y7sauces',
      youtube: 'y7sauces'
    },
    taxRate: 18,
    shippingRules: {
      freeShippingThreshold: 500,
      standardShippingRate: 50,
      expressShippingRate: 100
    },
    maintenanceMode: false,
    contactPageContent: 'Get in touch with us for any queries or support. We are here to help you!',
    downloadLinks: {
      catalogUrl: '',
      brochureUrl: '',
      priceListUrl: '',
      certificatesUrl: ''
    }
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();
  const { setSettings: setGlobalSettings } = useSettingsStore();

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${getApiBaseUrl()}/admin/settings`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('accessToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          console.log('📥 Fetched settings from API');
          console.log('📧 Email from API:', data.data.supportEmail);
          setSettings(data.data);
          setLastUpdated(new Date(data.data.updatedAt || new Date()));
        }
      } else {
        console.error('Settings fetch error:', response.status, response.statusText);
        // Keep default settings if fetch fails
        toast({
          title: 'Info',
          description: 'Using default settings. Save to create your configuration.',
        });
      }
      
    } catch (error) {
      console.error('Settings fetch error:', error);
      // Keep default settings if fetch fails
      toast({
        title: 'Info',
        description: 'Using default settings. Save to create your configuration.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      console.log('💾 Attempting to save settings...');
      console.log('📧 Email being saved:', settings.supportEmail);
      
      // Validate settings before saving
      const validationErrors = validateSettings(settings);
      if (validationErrors.length > 0) {
        console.error('❌ Validation failed:', validationErrors);
        toast({
          title: 'Validation Error',
          description: validationErrors[0].message,
          variant: 'destructive',
        });
        return;
      }

      setIsSaving(true);
      
      const response = await fetch(`${getApiBaseUrl()}/admin/settings`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('accessToken')}`
        },
        body: JSON.stringify(settings)
      });

      console.log('📡 Save response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Save failed:', errorData);
        throw new Error('Failed to save settings');
      }

      const data = await response.json();
      console.log('✅ Save successful, response data:', data.data);
      console.log('📧 Email in response:', data.data.supportEmail);
      
      setLastUpdated(new Date(data.data?.updatedAt || new Date()));

      // CRITICAL: Update global settings store with timestamp to force refresh
      const updatedSettings = {
        ...data.data,
        lastUpdated: new Date().toISOString(),
        _forceUpdate: Date.now() // Add unique timestamp to force update
      };
      
      console.log('📤 Broadcasting updated settings...');
      console.log('📧 Email in broadcast:', updatedSettings.supportEmail);
      
      setGlobalSettings(updatedSettings);
      
      // Force immediate refresh across all open tabs/windows
      window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: updatedSettings }));
      
      // Broadcast to other tabs using localStorage with timestamp
      const updatePayload = {
        timestamp: Date.now(),
        settings: updatedSettings,
        action: 'SETTINGS_UPDATED'
      };
      localStorage.setItem('settingsUpdate', JSON.stringify(updatePayload));
      
      // FORCE update the Zustand storage with new timestamp
      localStorage.setItem('y7-settings-storage', JSON.stringify({
        state: {
          settings: updatedSettings,
          lastFetch: 0 // Set to 0 to force refresh on next load
        },
        version: 0
      }));

      // Clear any cached settings in sessionStorage
      sessionStorage.removeItem('y7-settings-cache');

      toast({
        title: '✅ Success',
        description: 'Settings saved and updated across entire website immediately!',
      });
      
      console.log('✅ Settings saved and broadcasted to all pages');
      console.log('📢 Updated settings:', updatedSettings);
      console.log('📧 New email:', updatedSettings.supportEmail);
      
    } catch (error) {
      console.error('Settings save error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const clearAllCaches = async () => {
    try {
      // Clear all browser caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        console.log('✅ All caches cleared');
      }

      // Clear localStorage settings
      localStorage.removeItem('y7-settings-storage');
      localStorage.removeItem('settingsUpdate');
      
      // Clear sessionStorage
      sessionStorage.clear();

      // Force fetch fresh settings
      await fetchSettings();

      toast({
        title: '✅ Cache Cleared',
        description: 'All caches cleared and settings refreshed. Page will reload.',
      });

      // Reload page after 1 second
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Clear cache error:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear caches',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchSettings();
    
    // Auto-refresh settings every 5 minutes to sync with other admin users
    const interval = setInterval(() => {
      fetchSettings();
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof SiteSettings] as any,
        [field]: value
      }
    }));
  };

  const seoData = generateSEO({
    title: 'Settings - Y7 Sauces Admin',
    description: 'Configure site settings, contact information, and business rules.',
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gold/20 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-charcoal rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO {...seoData} />
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-cream">Settings</h1>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-cream/60">Configure site settings and business rules</p>
              {lastUpdated && (
                <div className="flex items-center text-cream/40 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                  Last updated: {lastUpdated.toLocaleString('en-IN')}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={clearAllCaches}
              variant="outline" 
              size="sm" 
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              disabled={isSaving}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear Cache
            </Button>
            <Button 
              onClick={fetchSettings}
              variant="outline" 
              size="sm" 
              className="border-gold/30 text-cream hover:bg-gold/10"
              disabled={isSaving}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={saveSettings}
              size="sm" 
              className="bg-gold hover:bg-gold/80 text-obsidian"
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-obsidian border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Social Media */}
          <Card className="bg-charcoal border-gold/20">
            <CardHeader>
              <CardTitle className="text-cream flex items-center">
                <Instagram className="w-5 h-5 mr-2" />
                Social Media Links
              </CardTitle>
              <CardDescription>Social media profiles and links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facebook" className="text-cream/80 flex items-center">
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook URL
                </Label>
                <Input
                  id="facebook"
                  value={settings.socialMedia.facebook}
                  onChange={(e) => handleNestedInputChange('socialMedia', 'facebook', e.target.value)}
                  className="bg-obsidian border-gold/20 text-cream mt-1"
                />
              </div>
              <div>
                <Label htmlFor="instagram" className="text-cream/80 flex items-center">
                  <Instagram className="w-4 h-4 mr-2" />
                  Instagram URL
                </Label>
                <Input
                  id="instagram"
                  value={settings.socialMedia.instagram}
                  onChange={(e) => handleNestedInputChange('socialMedia', 'instagram', e.target.value)}
                  className="bg-obsidian border-gold/20 text-cream mt-1"
                />
              </div>
              <div>
                <Label htmlFor="twitter" className="text-cream/80 flex items-center">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter URL
                </Label>
                <Input
                  id="twitter"
                  value={settings.socialMedia.twitter}
                  onChange={(e) => handleNestedInputChange('socialMedia', 'twitter', e.target.value)}
                  className="bg-obsidian border-gold/20 text-cream mt-1"
                />
              </div>
              <div>
                <Label htmlFor="youtube" className="text-cream/80 flex items-center">
                  <Youtube className="w-4 h-4 mr-2" />
                  YouTube URL
                </Label>
                <Input
                  id="youtube"
                  value={settings.socialMedia.youtube}
                  onChange={(e) => handleNestedInputChange('socialMedia', 'youtube', e.target.value)}
                  className="bg-obsidian border-gold/20 text-cream mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media Handles */}
          <Card className="bg-charcoal border-gold/20">
            <CardHeader>
              <CardTitle className="text-cream flex items-center">
                <Instagram className="w-5 h-5 mr-2" />
                Social Media Handles
              </CardTitle>
              <CardDescription>Username handles for social media (without @ symbol)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facebookHandle" className="text-cream/80 flex items-center">
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook Handle
                </Label>
                <div className="flex items-center mt-1">
                  <span className="text-cream/60 text-sm mr-2">@</span>
                  <Input
                    id="facebookHandle"
                    value={settings.socialMediaHandles.facebook}
                    onChange={(e) => handleNestedInputChange('socialMediaHandles', 'facebook', e.target.value)}
                    className="bg-obsidian border-gold/20 text-cream"
                    placeholder="y7sauces"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="instagramHandle" className="text-cream/80 flex items-center">
                  <Instagram className="w-4 h-4 mr-2" />
                  Instagram Handle
                </Label>
                <div className="flex items-center mt-1">
                  <span className="text-cream/60 text-sm mr-2">@</span>
                  <Input
                    id="instagramHandle"
                    value={settings.socialMediaHandles.instagram}
                    onChange={(e) => handleNestedInputChange('socialMediaHandles', 'instagram', e.target.value)}
                    className="bg-obsidian border-gold/20 text-cream"
                    placeholder="y7sauces"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="twitterHandle" className="text-cream/80 flex items-center">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter Handle
                </Label>
                <div className="flex items-center mt-1">
                  <span className="text-cream/60 text-sm mr-2">@</span>
                  <Input
                    id="twitterHandle"
                    value={settings.socialMediaHandles.twitter}
                    onChange={(e) => handleNestedInputChange('socialMediaHandles', 'twitter', e.target.value)}
                    className="bg-obsidian border-gold/20 text-cream"
                    placeholder="y7sauces"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="youtubeHandle" className="text-cream/80 flex items-center">
                  <Youtube className="w-4 h-4 mr-2" />
                  YouTube Handle
                </Label>
                <div className="flex items-center mt-1">
                  <span className="text-cream/60 text-sm mr-2">@</span>
                  <Input
                    id="youtubeHandle"
                    value={settings.socialMediaHandles.youtube}
                    onChange={(e) => handleNestedInputChange('socialMediaHandles', 'youtube', e.target.value)}
                    className="bg-obsidian border-gold/20 text-cream"
                    placeholder="y7sauces"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Rules */}
          <Card className="bg-charcoal border-gold/20">
            <CardHeader>
              <CardTitle className="text-cream flex items-center">
                <Percent className="w-5 h-5 mr-2" />
                Business Rules
              </CardTitle>
              <CardDescription>Tax rates and shipping configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="taxRate" className="text-cream/80">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={settings.taxRate}
                  onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                  className="bg-obsidian border-gold/20 text-cream mt-1"
                />
              </div>
              <Separator className="bg-gold/20" />
              <div>
                <Label htmlFor="freeShippingThreshold" className="text-cream/80">Free Shipping Threshold (₹)</Label>
                <Input
                  id="freeShippingThreshold"
                  type="number"
                  min="0"
                  value={settings.shippingRules.freeShippingThreshold}
                  onChange={(e) => handleNestedInputChange('shippingRules', 'freeShippingThreshold', parseFloat(e.target.value) || 0)}
                  className="bg-obsidian border-gold/20 text-cream mt-1"
                />
              </div>
              <div>
                <Label htmlFor="standardShippingRate" className="text-cream/80">Standard Shipping Rate (₹)</Label>
                <Input
                  id="standardShippingRate"
                  type="number"
                  min="0"
                  value={settings.shippingRules.standardShippingRate}
                  onChange={(e) => handleNestedInputChange('shippingRules', 'standardShippingRate', parseFloat(e.target.value) || 0)}
                  className="bg-obsidian border-gold/20 text-cream mt-1"
                />
              </div>
              <div>
                <Label htmlFor="expressShippingRate" className="text-cream/80">Express Shipping Rate (₹)</Label>
                <Input
                  id="expressShippingRate"
                  type="number"
                  min="0"
                  value={settings.shippingRules.expressShippingRate}
                  onChange={(e) => handleNestedInputChange('shippingRules', 'expressShippingRate', parseFloat(e.target.value) || 0)}
                  className="bg-obsidian border-gold/20 text-cream mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Settings */}
        <Card className="bg-charcoal border-gold/20">
          <CardHeader>
            <CardTitle className="text-cream flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2" />
              System Settings
            </CardTitle>
            <CardDescription>Site-wide system configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="font-medium text-cream">Maintenance Mode</p>
                  <p className="text-sm text-cream/60">
                    Enable to show maintenance page to visitors
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
              />
            </div>

            <div>
              <Label htmlFor="contactPageContent" className="text-cream/80">Contact Page Content</Label>
              <Textarea
                id="contactPageContent"
                value={settings.contactPageContent}
                onChange={(e) => handleInputChange('contactPageContent', e.target.value)}
                className="bg-obsidian border-gold/20 text-cream mt-1"
                rows={4}
                placeholder="Enter the content that will be displayed on the contact page..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Download Links Management */}
        <Card className="bg-charcoal border-gold/20">
          <CardHeader>
            <CardTitle className="text-cream flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Download Links Management
            </CardTitle>
            <CardDescription>Manage downloadable resources URLs (Google Drive, Dropbox, etc.)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="catalogUrl" className="text-cream/80 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Product Catalog URL
              </Label>
              <Input
                id="catalogUrl"
                value={settings.downloadLinks.catalogUrl}
                onChange={(e) => handleNestedInputChange('downloadLinks', 'catalogUrl', e.target.value)}
                className="bg-obsidian border-gold/20 text-cream mt-1"
                placeholder="https://drive.google.com/file/d/..."
              />
              <p className="text-xs text-cream/40 mt-1">
                {settings.downloadLinks.catalogUrl ? 'Download button will be visible' : 'Download button will be hidden'}
              </p>
            </div>
            
            <div>
              <Label htmlFor="brochureUrl" className="text-cream/80 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Company Brochure URL
              </Label>
              <Input
                id="brochureUrl"
                value={settings.downloadLinks.brochureUrl}
                onChange={(e) => handleNestedInputChange('downloadLinks', 'brochureUrl', e.target.value)}
                className="bg-obsidian border-gold/20 text-cream mt-1"
                placeholder="https://drive.google.com/file/d/..."
              />
              <p className="text-xs text-cream/40 mt-1">
                {settings.downloadLinks.brochureUrl ? 'Download button will be visible' : 'Download button will be hidden'}
              </p>
            </div>
            
            <div>
              <Label htmlFor="priceListUrl" className="text-cream/80 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Price List URL
              </Label>
              <Input
                id="priceListUrl"
                value={settings.downloadLinks.priceListUrl}
                onChange={(e) => handleNestedInputChange('downloadLinks', 'priceListUrl', e.target.value)}
                className="bg-obsidian border-gold/20 text-cream mt-1"
                placeholder="https://drive.google.com/file/d/..."
              />
              <p className="text-xs text-cream/40 mt-1">
                {settings.downloadLinks.priceListUrl ? 'Download button will be visible' : 'Download button will be hidden'}
              </p>
            </div>
            
            <div>
              <Label htmlFor="certificatesUrl" className="text-cream/80 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Certificates & Compliance URL
              </Label>
              <Input
                id="certificatesUrl"
                value={settings.downloadLinks.certificatesUrl}
                onChange={(e) => handleNestedInputChange('downloadLinks', 'certificatesUrl', e.target.value)}
                className="bg-obsidian border-gold/20 text-cream mt-1"
                placeholder="https://drive.google.com/file/d/..."
              />
              <p className="text-xs text-cream/40 mt-1">
                {settings.downloadLinks.certificatesUrl ? 'Download button will be visible' : 'Download button will be hidden'}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <LinkIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">URL Guidelines</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use direct download links from Google Drive, Dropbox, or similar services</li>
                    <li>For Google Drive: Use the direct download format or shareable link</li>
                    <li>Empty URLs will hide the corresponding download buttons</li>
                    <li>Test URLs before saving to ensure they work correctly</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SettingsPage;