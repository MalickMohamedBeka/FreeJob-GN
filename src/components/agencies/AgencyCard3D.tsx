import { motion } from "framer-motion";
import { MapPin, Briefcase, TrendingUp, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { memo } from "react";
import type { ApiAgencyProfile } from "@/types";

const AgencyCard3D = memo(({ agency, index }: { agency: ApiAgencyProfile; index: number }) => {
  const agencyName = agency.agency_details?.agency_name || agency.username;
  const location = [agency.city_or_region, agency.country].filter(Boolean).join(", ");
  const initials = agencyName.slice(0, 2).toUpperCase();
  const foundedYear = agency.agency_details?.founded_at
    ? new Date(agency.agency_details.founded_at).getFullYear()
    : null;
  const hourlyRate = agency.hourly_rate ? parseFloat(agency.hourly_rate) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut", delay: (index % 3) * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl border border-border hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Header band */}
      <div className="bg-secondary/5 pt-8 pb-12" />

      {/* Avatar */}
      <div className="flex justify-center -mt-8 mb-3">
        {agency.profile_picture ? (
          <img
            src={agency.profile_picture}
            alt={agencyName}
            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-sm"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-lg border-4 border-white shadow-sm">
            {initials}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-5 pb-5 text-center">
        <h3 className="font-bold text-lg mb-0.5">{agencyName}</h3>
        <p className="text-muted-foreground text-sm mb-3">
          {agency.speciality?.name ?? "Agence"}
        </p>

        {/* Location */}
        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-4">
          {location && (
            <div className="flex items-center gap-1">
              <MapPin size={13} />
              <span>{location}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-4">
          {agency.skills.slice(0, 4).map((skill) => (
            <span
              key={skill.id}
              className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium"
            >
              {skill.name}
            </span>
          ))}
          {agency.skills.length > 4 && (
            <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs">
              +{agency.skills.length - 4}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/50 rounded-lg p-2">
            <Building2 size={13} className="text-secondary shrink-0" />
            <span className="text-xs">
              {foundedYear ? `Fondée ${foundedYear}` : "Agence"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/50 rounded-lg p-2">
            <TrendingUp size={13} className="text-primary shrink-0" />
            <span className="text-xs">
              {hourlyRate ? `${hourlyRate.toLocaleString()} GNF/h` : "Sur devis"}
            </span>
          </div>
        </div>

        <Button className="w-full bg-secondary hover:bg-secondary/90" size="sm" asChild>
          <Link to={`/agencies/${agency.id}`}>Voir le profil</Link>
        </Button>
      </div>
    </motion.div>
  );
});

AgencyCard3D.displayName = "AgencyCard3D";
export default AgencyCard3D;
