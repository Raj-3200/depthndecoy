import { forwardRef, ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = forwardRef<HTMLDivElement, LayoutProps>(({ children }, ref) => {
  return (
    <div ref={ref} className="min-h-screen bg-background flex flex-col">
      {/* Grain Overlay */}
      <div className="grain-overlay" />
      
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
});

Layout.displayName = "Layout";

export default Layout;
