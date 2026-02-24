import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: Attempted to access", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <section className="pt-40 pb-20 min-h-[80vh] flex items-center justify-center">
        <div className="container-premium text-center">
          <h1 className="text-display text-foreground mb-4">404</h1>
          <p className="text-lg font-light text-muted-foreground mb-10 max-w-md mx-auto">
            The page you're looking for doesn't exist. Let's get you back on track.
          </p>
          <Link to="/" className="btn-primary">
            Return Home
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
