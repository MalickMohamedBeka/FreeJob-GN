const partners = [
  { name: "Partenaire 1", logo: "/partners/partner-1.png" },
  { name: "Partenaire 2", logo: "/partners/partner-2.jpg" },
  { name: "Partenaire 3", logo: "/partners/partner-3.jpg" },
  { name: "Partenaire 4", logo: "/partners/partner-4.jpg" },
  { name: "Partenaire 5", logo: "/partners/partner-5.jpg" },
  { name: "Partenaire 6", logo: "/partners/partner-6.jpg" },
  { name: "Partenaire 7", logo: "/partners/partner-7.png" },
];

const PartnersCarousel = () => {
  const duplicated = [...partners, ...partners];

  return (
    <section className="py-16 bg-white border-y border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Nos <span className="text-secondary">Partenaires</span> de Confiance
          </h2>
          <p className="text-muted-foreground">
            Ils nous font confiance pour connecter les talents africains
          </p>
        </div>

        <div className="relative overflow-hidden">
          {/* Fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div
            className="flex gap-8 items-center"
            style={{
              animation: "scroll-x 30s linear infinite",
              width: "max-content",
            }}
          >
            {duplicated.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex-shrink-0 w-32 h-20 bg-muted/30 rounded-lg border border-border flex items-center justify-center p-4"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain grayscale opacity-60"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector(".fallback")) {
                      const el = document.createElement("span");
                      el.className = "fallback text-xs font-semibold text-muted-foreground text-center";
                      el.textContent = partner.name;
                      parent.appendChild(el);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-x {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default PartnersCarousel;
