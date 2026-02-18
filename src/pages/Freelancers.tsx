import { useState } from "react";
import { Search, Loader2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FreelancersHero3D from "@/components/freelancers/FreelancersHero3D";
import SearchBar3D from "@/components/freelancers/SearchBar3D";
import FreelancerCard3D from "@/components/freelancers/FreelancerCard3D";
import { useFreelancers } from "@/hooks/useFreelancers";
import { Button } from "@/components/ui/button";
import type { Freelancer } from "@/types";
import type { ApiFreelancerProfile } from "@/types";

const skillFilters = ["Tous", "React", "Design", "Marketing", "Mobile", "Python", "SEO", "Data Science", "Blockchain"];

function mapApiFreelancerToUI(f: ApiFreelancerProfile): Freelancer {
  const fullName = f.freelance_details
    ? `${f.freelance_details.first_name} ${f.freelance_details.last_name}`
    : f.username;
  return {
    id: String(f.id),
    name: fullName,
    title: f.speciality?.name || "Freelancer",
    avatar: f.profile_picture || "",
    rating: 5,
    reviewsCount: 0,
    hourlyRate: f.hourly_rate ? Number(f.hourly_rate) : 0,
    currency: "GNF",
    skills: f.skills.map((s) => s.name),
    completedProjects: 0,
    location: [f.city_or_region, f.country].filter(Boolean).join(", "),
    available: true,
    bio: f.bio || "",
  };
}

const Freelancers = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useFreelancers({ page });

  const results = data?.results ?? [];

  const filtered = results.filter((f) => {
    const ui = mapApiFreelancerToUI(f);
    const matchesSearch =
      !search ||
      ui.name.toLowerCase().includes(search.toLowerCase()) ||
      ui.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "Tous" ||
      f.skills.some((s) => s.name.toLowerCase().includes(activeFilter.toLowerCase()));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="pt-16">
        <FreelancersHero3D />

        <div className="container mx-auto px-4 lg:px-8 py-10 pb-24">
          <SearchBar3D
            search={search}
            setSearch={setSearch}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            filters={skillFilters}
            viewMode={viewMode}
            setViewMode={setViewMode}
            resultsCount={filtered.length}
          />

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={36} />
            </div>
          ) : filtered.length > 0 ? (
            <>
              <div
                className={
                  viewMode === "grid"
                    ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4 max-w-3xl mx-auto"
                }
              >
                {filtered.map((freelancer, index) => (
                  <FreelancerCard3D
                    key={freelancer.id}
                    freelancer={mapApiFreelancerToUI(freelancer)}
                    index={index}
                  />
                ))}
              </div>

              {data?.next && (
                <div className="text-center mt-12">
                  <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
                    <Users size={16} className="mr-2" />
                    Découvrir Plus de Talents
                  </Button>
                </div>
              )}

              {filtered.length > 0 && (
                <div className="mt-16 bg-primary rounded-2xl p-10 text-center">
                  <h2 className="text-2xl font-bold text-white mb-3">
                    Vous êtes un Talent ?
                  </h2>
                  <p className="text-white/80 mb-6 max-w-xl mx-auto">
                    Rejoignez notre communauté de freelancers et accédez à des projets exceptionnels
                  </p>
                  <Button variant="cta" asChild>
                    <Link to="/signup">Créer Mon Profil Gratuitement</Link>
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <Search className="mx-auto text-muted-foreground mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">Aucun talent trouvé</h3>
              <p className="text-muted-foreground mb-6">
                Essayez de modifier vos critères de recherche
              </p>
              <Button
                variant="outline"
                onClick={() => { setSearch(""); setActiveFilter("Tous"); }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Freelancers;
