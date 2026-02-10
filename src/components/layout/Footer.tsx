import { Link } from "react-router-dom";

const footerLinks = {
  Plateforme: [
    { label: "Trouver des Projets", path: "/projects" },
    { label: "Trouver des Freelancers", path: "/freelancers" },
    { label: "Comment ça marche", path: "/about" },
  ],
  Entreprise: [
    { label: "À Propos", path: "/about" },
    { label: "Carrières", path: "#" },
    { label: "Contact", path: "#" },
  ],
  Ressources: [
    { label: "Blog", path: "#" },
    { label: "Aide & Support", path: "#" },
    { label: "Conditions d'utilisation", path: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="FreeJobGN" className="h-10 w-auto" />
              <span className="text-2xl font-bold text-gradient-hero">FreeJobGN</span>
            </div>
            <p className="mt-4 text-sm text-background/60 leading-relaxed">
              La première plateforme freelance de Guinée. Connectez les talents locaux avec des opportunités mondiales.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-background mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-background/60 hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} FreeJobGN. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-sm text-background/50 hover:text-primary transition-colors">
              Confidentialité
            </Link>
            <Link to="#" className="text-sm text-background/50 hover:text-primary transition-colors">
              Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
