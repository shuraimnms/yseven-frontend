import { useGlobalSettings } from '@/hooks/useGlobalSettings';
import { AlertTriangle, Wrench, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const MaintenanceMode = ({ children }: { children: React.ReactNode }) => {
  const { maintenanceMode, siteTitle, supportEmail } = useGlobalSettings();

  if (!maintenanceMode) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-charcoal border-gold/20">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-2xl font-bold text-cream mb-2">
              {siteTitle} is Under Maintenance
            </h1>
            <p className="text-cream/60">
              We're currently performing scheduled maintenance to improve your experience.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-center text-cream/80">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">We'll be back shortly</span>
            </div>
            
            <div className="flex items-center justify-center text-cream/80">
              <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
              <span className="text-sm">Sorry for the inconvenience</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-cream/60 text-sm mb-2">
              For urgent inquiries, please contact us:
            </p>
            <a 
              href={`mailto:${supportEmail}`}
              className="text-gold hover:text-gold/80 transition-colors text-sm font-medium"
            >
              {supportEmail}
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceMode;