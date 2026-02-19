import { Rocket, TrendingUp, Zap } from "lucide-react";

const ProjectsHero3D = () => {
  return (
    <div className="bg-primary py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-semibold mb-6">
            <Zap size={14} />
            +150 Nouveaux Projets ce Mois
            <TrendingUp size={14} />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Projets & Opportunités
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Découvrez des opportunités uniques et connectez-vous avec des clients
            qui transforment l'Afrique digitale
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-10">
            {[
              { icon: Rocket, value: "500+", label: "Projets Actifs" },
              { icon: Zap, value: "2 500+", label: "Freelancers" },
              { icon: TrendingUp, value: "98%", label: "Satisfaction" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsHero3D;
