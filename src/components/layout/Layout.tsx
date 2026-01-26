import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MaintenanceMode from "../MaintenanceMode";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <MaintenanceMode>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </MaintenanceMode>
  );
};

export default Layout;
