import { motion } from "framer-motion";
import { Bookmark, Clock, Coins, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const jobs = [
  {
    id: 1,
    title: "Développeur React Senior",
    company: "MTN Guinée",
    location: "Conakry",
    budget: "15,000 - 20,000 GNF",
    postedAt: "Il y a 1h",
    proposals: 3,
    tags: ["React", "TypeScript", "Node.js"],
    saved: false,
  },
  {
    id: 2,
    title: "Designer UI/UX pour Application Mobile",
    company: "Orange Guinée",
    location: "Remote",
    budget: "10,000 - 15,000 GNF",
    postedAt: "Il y a 3h",
    proposals: 8,
    tags: ["Figma", "UI/UX", "Mobile"],
    saved: true,
  },
  {
    id: 3,
    title: "Développeur Full Stack Laravel",
    company: "Ecobank Guinée",
    location: "Conakry",
    budget: "12,000 - 18,000 GNF",
    postedAt: "Il y a 5h",
    proposals: 12,
    tags: ["Laravel", "Vue.js", "MySQL"],
    saved: false,
  },
];

const AvailableJobs = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Projets Disponibles</h3>
          <Button variant="ghost" size="sm">
            Voir tout
          </Button>
        </div>

        <div className="space-y-4">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="p-4 rounded-xl border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{job.title}</h4>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                </div>
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    job.saved
                      ? "bg-primary text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  <Bookmark size={18} fill={job.saved ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {job.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{job.postedAt}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Coins size={14} />
                  <span>{job.budget}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{job.proposals} propositions</span>
                </div>
              </div>

              <Button className="w-full" size="sm">
                Soumettre une proposition
              </Button>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default AvailableJobs;
