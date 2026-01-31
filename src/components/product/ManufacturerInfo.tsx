import { useState } from "react";
import { ChevronDown, ChevronUp, Factory, Shield, MapPin, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useManufacturerInfo, useManufacturerAddress } from "@/hooks/useManufacturerInfo";

interface ManufacturerInfoProps {
  className?: string;
  variant?: "collapsible" | "tabs" | "inline";
}

const ManufacturerInfo = ({ className, variant = "collapsible" }: ManufacturerInfoProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const manufacturerData = useManufacturerInfo();
  const manufacturerAddress = useManufacturerAddress();

  if (variant === "inline") {
    return (
      <div className={cn("bg-charcoal/30 rounded-lg p-6 border border-gold/10", className)}>
        <h3 className="text-lg font-semibold text-cream mb-4 flex items-center gap-2">
          <Factory className="w-5 h-5 text-gold" />
          Manufacturer Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-cream/60">Manufactured By:</span>
            <p className="text-cream font-medium">{manufacturerData.manufacturer}</p>
          </div>
          <div>
            <span className="text-cream/60">Brand Owner:</span>
            <p className="text-cream font-medium">{manufacturerData.brandOwner}</p>
          </div>
          <div className="md:col-span-2">
            <span className="text-cream/60">Manufacturing Address:</span>
            <p className="text-cream">{manufacturerAddress.full}</p>
          </div>
          <div>
            <span className="text-cream/60">Country of Origin:</span>
            <p className="text-cream">{manufacturerData.countryOfOrigin}</p>
          </div>
          <div>
            <span className="text-cream/60">FSSAI License No:</span>
            <p className="text-cream">{manufacturerData.fssaiNo}</p>
          </div>
          <div>
            <span className="text-cream/60">Customer Care:</span>
            <p className="text-cream">{manufacturerData.customerCare}</p>
          </div>
          <div>
            <span className="text-cream/60">Phone:</span>
            <p className="text-cream">{manufacturerData.customerPhone}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("border border-gold/20 rounded-lg bg-charcoal/20", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gold/5 transition-colors duration-300"
      >
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-gold" />
          <span className="font-medium text-cream">Manufacturer Information</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-cream/60" />
        ) : (
          <ChevronDown className="w-5 h-5 text-cream/60" />
        )}
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="p-4 pt-0 border-t border-gold/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div>
                <span className="text-cream/60 text-xs uppercase tracking-wide">Manufactured By</span>
                <p className="text-cream font-medium">{manufacturerData.manufacturer}</p>
              </div>
              <div>
                <span className="text-cream/60 text-xs uppercase tracking-wide">Brand Owner</span>
                <p className="text-cream font-medium">{manufacturerData.brandOwner}</p>
              </div>
              <div>
                <span className="text-cream/60 text-xs uppercase tracking-wide">Country of Origin</span>
                <p className="text-cream">{manufacturerData.countryOfOrigin}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-cream/60 text-xs uppercase tracking-wide">FSSAI License No</span>
                <p className="text-cream">{manufacturerData.fssaiNo}</p>
              </div>
              <div>
                <span className="text-cream/60 text-xs uppercase tracking-wide flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Customer Care
                </span>
                <p className="text-cream">{manufacturerData.customerCare}</p>
              </div>
              <div>
                <span className="text-cream/60 text-xs uppercase tracking-wide flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Phone
                </span>
                <p className="text-cream">{manufacturerData.customerPhone}</p>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <span className="text-cream/60 text-xs uppercase tracking-wide flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Manufacturing Address
              </span>
              <p className="text-cream text-sm leading-relaxed">{manufacturerAddress.full}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerInfo;