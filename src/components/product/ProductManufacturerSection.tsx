import ManufacturerInfo from "./ManufacturerInfo";

interface ProductManufacturerSectionProps {
  className?: string;
}

const ProductManufacturerSection = ({ className }: ProductManufacturerSectionProps) => {
  return (
    <div className={className}>
      <h2 className="text-2xl font-semibold text-cream mb-6">Product Information</h2>
      <ManufacturerInfo variant="collapsible" />
    </div>
  );
};

export default ProductManufacturerSection;