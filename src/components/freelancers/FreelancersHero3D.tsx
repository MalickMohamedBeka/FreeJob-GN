import { Users, Globe, Star, TrendingUp } from "lucide-react";

const FreelancersHero3D = () => {
  return (
    <div className="bg-primary py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-semibold mb-6">
            <Users size={14} />
            2 500+ Talents Vérifiés
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Talents Africains d'Exception
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Connectez-vous avec les meilleurs freelancers africains et internationaux.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-10">
            {[
              { icon: Users, value: "2 500+", label: "Freelancers" },
              { icon: Globe, value: "50+", label: "Pays" },
              { icon: Star, value: "4.9/5", label: "Note Moyenne" },
              { icon: TrendingUp, value: "98%", label: "Succès" },
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

export default FreelancersHero3D;
