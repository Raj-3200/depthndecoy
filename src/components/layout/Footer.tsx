import { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="border-t border-border bg-background" role="contentinfo">
      <div className="container-premium py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block" aria-label="Depth & Decoy Home">
              <img
                src="/DepthnDecoy.jpg"
                alt="Depth & Decoy"
                className="h-12 w-12 rounded-full object-cover border border-border/40"
                loading="lazy"
                width={48}
                height={48}
              />
            </Link>
            <p className="mt-5 text-sm font-light text-muted-foreground max-w-xs leading-relaxed">
              Not for the surface. Premium menswear crafted for those who
              understand depth over noise.
            </p>
            <div className="mt-5 space-y-1.5 text-sm text-muted-foreground">
              <a
                href="mailto:depthanddecoy@gmail.com"
                className="block hover:text-foreground transition-colors"
              >
                depthanddecoy@gmail.com
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <nav aria-label="Shop links">
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-5 font-medium">
              Shop
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/shop", label: "All Products" },
                { to: "/collections", label: "Collections" },
                { to: "/shop?category=tops", label: "Tops" },
                { to: "/shop?category=bottoms", label: "Bottoms" },
                { to: "/shop?category=outerwear", label: "Outerwear" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-foreground/80 hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Support Links */}
          <nav aria-label="Support links">
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-5 font-medium">
              Support
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/about", label: "About Us" },
                { to: "/about#contact", label: "Contact" },
                { to: "/about#shipping", label: "Shipping & Returns" },
                { to: "/about#faq", label: "FAQ" },
                { to: "/about#size-guide", label: "Size Guide" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-foreground/80 hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter */}
          <div>
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-5 font-medium">
              Join the Inner Circle
            </h4>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Early access to drops, exclusive content, and member-only pricing.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                aria-label="Email for newsletter"
                className="bg-input border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-muted-foreground transition-colors"
              />
              <button
                type="submit"
                className="btn-primary text-xs py-3"
              >
                {subscribed ? "Subscribed ✓" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
            © {currentYear} Depth & Decoy. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/about#privacy"
              className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/about#terms"
              className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
