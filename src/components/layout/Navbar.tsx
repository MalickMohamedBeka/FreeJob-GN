import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Accueil", path: "/" },
  { label: "Freelancers", path: "/freelancers" },
  { label: "Projets", path: "/projects" },
  { label: "Comment ça marche", path: "/comment-ca-marche" },
  { label: "À Propos", path: "/about" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const dashboardPath = user?.role === "CLIENT" ? "/client/dashboard" : "/dashboard";

  const handleLogout = async () => {
    setIsMobileOpen(false);
    await logout();
    navigate("/login");
  };

  const close = () => setIsMobileOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-border shadow-[0_1px_12px_0_rgba(0,0,0,0.06)]"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="FreeJobGN" className="h-24 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-colors hover:text-primary pb-0.5 ${
                  location.pathname === link.path
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-primary"
                    : "text-foreground/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={dashboardPath}>Dashboard</Link>
                </Button>
                <Button variant="default" size="sm" onClick={handleLogout}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Connexion</Link>
                </Button>
                <Button variant="cta" size="sm" asChild>
                  <Link to="/signup">S'inscrire</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            aria-label="Ouvrir le menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-50 md:hidden"
            onClick={close}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div className="fixed inset-y-0 right-0 w-72 bg-white z-50 md:hidden shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-border flex-shrink-0">
              <Link to="/" onClick={close} className="flex items-center">
                <img src="/logo.png" alt="FreeJobGN" className="h-20 w-auto object-contain" />
              </Link>
              <button
                onClick={close}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Fermer le menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={close}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Auth actions */}
            <div className="px-4 py-5 border-t border-border flex flex-col gap-2 flex-shrink-0">
              {isAuthenticated ? (
                <>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={dashboardPath} onClick={close}>Dashboard</Link>
                  </Button>
                  <Button variant="default" className="w-full" onClick={handleLogout}>
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/login" onClick={close}>Connexion</Link>
                  </Button>
                  <Button variant="cta" className="w-full" asChild>
                    <Link to="/signup" onClick={close}>S'inscrire</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
