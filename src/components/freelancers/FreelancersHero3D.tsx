import { motion } from "framer-motion";
import { Users, Globe, Zap, Award, TrendingUp, Star, Target } from "lucide-react";

const FreelancersHero3D = () => {
  // Sample freelancer avatars for the floating showcase
  const topFreelancers = [
    { name: "Amadou Diallo", specialty: "Full-Stack" },
    { name: "Fatoumata Camara", specialty: "UI/UX" },
    { name: "Ibrahim Konaté", specialty: "Mobile" },
    { name: "Aissatou Sow", specialty: "Marketing" },
    { name: "Mamadou Bah", specialty: "Data Science" },
  ];

  return (
    <div className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-8"
          >
            <div className="inline-block">
              <div className="glass rounded-full px-8 py-4 shadow-elevation-4 border-2 border-white/40 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <Award className="text-primary" size={24} />
                  <span className="font-bold text-lg">
                    <span className="text-gradient-hero">2,500+</span> Talents Vérifiés
                  </span>
                  <Award className="text-warning" size={24} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-8"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              <span className="text-gradient-hero">Talents</span>
              <br />
              <span className="text-foreground">Extraordinaires</span>
              <br />
              <span className="text-muted-foreground text-5xl md:text-6xl">
                du Monde Entier
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium"
            >
              Connectez-vous avec les meilleurs freelancers africains et internationaux.
              <br />
              <span className="text-gradient-hero font-bold">Excellence • Innovation • Passion</span>
            </motion.p>
          </motion.div>

          {/* Floating Freelancer Avatars Showcase */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center items-center gap-4 mb-12 flex-wrap"
          >
            {topFreelancers.map((freelancer, i) => (
              <motion.div
                key={freelancer.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.5 + i * 0.05
                }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -8,
                  transition: { duration: 0.2 }
                }}
                className="relative"
              >
                <div className="relative">
                  {/* Avatar */}
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-elevation-4">
                    <img
                      src={`/avatars/freelancer-${(i % 15) + 1}.jpg`}
                      alt={freelancer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Specialty Badge */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 glass-dark backdrop-blur-xl rounded-full px-3 py-1 whitespace-nowrap shadow-elevation-2">
                    <span className="text-white text-xs font-bold">{freelancer.specialty}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {[
              { 
                icon: Users, 
                value: "2,500+", 
                label: "Freelancers Actifs", 
                color: "from-primary via-warning to-secondary"
              },
              { 
                icon: Globe, 
                value: "50+", 
                label: "Pays Représentés", 
                color: "from-secondary via-primary to-success"
              },
              { 
                icon: Star, 
                value: "4.9/5", 
                label: "Note Moyenne", 
                color: "from-warning via-primary to-secondary"
              },
              { 
                icon: TrendingUp, 
                value: "98%", 
                label: "Taux de Succès", 
                color: "from-success via-secondary to-primary"
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.7 + i * 0.05
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="glass rounded-3xl p-6 shadow-elevation-4 border-2 border-white/40 group"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-elevation-3`}>
                  <stat.icon className="text-white" size={32} />
                </div>

                <p className="text-4xl font-black text-gradient-hero mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FreelancersHero3D;
