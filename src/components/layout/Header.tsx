import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { items } = useCart();
  const { user } = useAuth();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/collections", label: "Collections" },
    { href: "/about", label: "About" },
  ];

  return (
    <>
      <header
        role="banner"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-premium ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border/60"
            : "bg-transparent"
        }`}
      >
        <div className="container-premium">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link
              to="/"
              className="flex items-center gap-3 group"
              aria-label="Depth and Decoy Home"
            >
              <img
                src="/DepthnDecoy.jpg"
                alt="Depth and Decoy"
                className="h-10 w-10 md:h-11 md:w-11 rounded-full object-cover border border-border/40"
                loading="eager"
                width={44}
                height={44}
              />
              <div className="hidden sm:flex flex-col leading-none">
                <span className="font-display text-base tracking-[0.18em] text-foreground group-hover:text-muted-foreground transition-colors duration-300">
                  DEPTH & DECOY
                </span>
                <span className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground mt-0.5">
                  We Win
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-10" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-[11px] tracking-[0.18em] uppercase font-medium link-underline transition-colors duration-300 ${
                    location.pathname === link.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-5">
              <Link
                to={user ? "/account" : "/auth"}
                className="hidden md:flex text-muted-foreground hover:text-foreground transition-colors duration-300"
                aria-label={user ? "My Account" : "Sign In"}
              >
                <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </Link>
              <Link
                to="/cart"
                className="relative text-muted-foreground hover:text-foreground transition-colors duration-300"
                aria-label={`Shopping bag with ${cartItemCount} items`}
              >
                <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center bg-foreground text-background text-[8px] font-semibold rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden text-foreground p-1"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-background"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="container-premium h-full flex flex-col">
              <div className="flex items-center justify-between h-16">
                <Link to="/" className="flex items-center gap-3" aria-label="Home">
                  <img
                    src="/DepthnDecoy.jpg"
                    alt="Depth and Decoy"
                    className="h-10 w-10 rounded-full object-cover border border-border/40"
                    width={40}
                    height={40}
                  />
                  <span className="font-display text-base tracking-[0.18em] text-foreground">
                    DEPTH & DECOY
                  </span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-foreground p-1"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <nav className="flex-1 flex flex-col justify-center gap-6" aria-label="Mobile navigation">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                  >
                    <Link
                      to={link.href}
                      className={`font-display text-4xl tracking-[0.1em] transition-colors duration-300 ${
                        location.pathname === link.href
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="pb-8 flex items-center gap-8 border-t border-border pt-6">
                <Link
                  to={user ? "/account" : "/auth"}
                  className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  {user ? "Account" : "Sign In"}
                </Link>
                <Link
                  to="/cart"
                  className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cart ({cartItemCount})
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;