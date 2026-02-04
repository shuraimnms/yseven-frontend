import { useMemo } from 'react';

export interface ManufacturerInfo {
  manufacturer: string;
  brandOwner: string;
  address: string;
  city: string;
  state: string;
  country: string;
  countryOfOrigin: string;
  fssaiNo: string;
  gstinNo: string;
  iecNo: string;
  rcmcNo: string;
  customerCare: string;
  customerPhone: string;
  website: string;
}

export const useManufacturerInfo = (): ManufacturerInfo => {
  return useMemo(() => ({
    manufacturer: "Crush In Agro Products",
    brandOwner: "Y-Seven",
    address: "Plot 120, Survey No. 6, 8B, II Stage, Mundargi Industrial Estate",
    city: "Ballari",
    state: "Karnataka", 
    country: "India",
    countryOfOrigin: "India",
    fssaiNo: "10019022001234",
    gstinNo: "04ABCDE1234F1Z5",
    iecNo: "BQEPS7979D",
    rcmcNo: "RCMC/APEDA/24897/2025-2026",
    customerCare: "support@ysevenfoods.com",
    customerPhone: "+91-172-1234567",
    website: "www.ysevenfoods.com"
  }), []);
};

export const useManufacturerAddress = () => {
  const info = useManufacturerInfo();
  
  return useMemo(() => ({
    full: `${info.address}, ${info.city} – 583101, ${info.state}, ${info.country}`,
    short: `${info.city}, ${info.state}, ${info.country}`,
    formatted: {
      line1: info.address,
      line2: `${info.city} – 583101`,
      line3: `${info.state}, ${info.country}`
    }
  }), [info]);
};