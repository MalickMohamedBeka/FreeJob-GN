import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, BadgeCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const clientPerks = [
  "Publication de projet 100% gratuite",
  "Propositions de prestataires en quelques minutes",
  "Paiement sécurisé via escrow",
  "Messagerie privée intégrée",
];

const freelancerPerks = [
  "Inscription et profil gratuits",
  "Accès à des projets qualifiés chaque jour",
  "Paiement garanti à la livraison",
  "0% de commission sur vos revenus",
];

const DualCTA = () => (
  <section className="py-20 lg:py-28 bg-muted/40">
    <div className="container mx-auto px-4 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-xl mx-auto mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Quel est votre profil ?
        </h2>
        <p className="text-muted-foreground text-lg">
          FreeJobGN s'adapte à vos besoins, que vous soyez client ou prestataire.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">

        {/* Client card — navy */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-2xl bg-primary p-8 lg:p-10 flex flex-col"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-6">
            <Briefcase size={26} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Je suis client</h3>
          <p className="text-white/70 text-sm mb-7 leading-relaxed">
            Trouvez le freelancer ou l'agence idéal pour votre projet en quelques clics.
          </p>
          <ul className="space-y-3 mb-8 flex-1">
            {clientPerks.map((perk) => (
              <li key={perk} className="flex items-start gap-2.5 text-sm text-white/85">
                <CheckCircle2 size={15} className="text-white/50 mt-0.5 flex-shrink-0" />
                {perk}
              </li>
            ))}
          </ul>
          <div className="space-y-3">
            <Button variant="cta" size="lg" className="w-full rounded-full font-semibold" asChild>
              <Link to="/signup">
                Publier un projet gratuitement
                <ArrowRight size={17} />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-white/70 hover:text-white hover:bg-white/10 rounded-full"
              asChild
            >
              <Link to="/comment-ca-marche">Comment ça marche ?</Link>
            </Button>
          </div>
        </motion.div>

        {/* Freelancer card — outlined */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-2xl bg-white border-2 border-primary p-8 lg:p-10 flex flex-col"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <BadgeCheck size={26} className="text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Je suis freelancer</h3>
          <p className="text-muted-foreground text-sm mb-7 leading-relaxed">
            Développez votre activité, décrochez des missions et faites-vous payer en toute sécurité.
          </p>
          <ul className="space-y-3 mb-8 flex-1">
            {freelancerPerks.map((perk) => (
              <li key={perk} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <CheckCircle2 size={15} className="text-primary mt-0.5 flex-shrink-0" />
                {perk}
              </li>
            ))}
          </ul>
          <div className="space-y-3">
            <Button variant="default" size="lg" className="w-full rounded-full font-semibold" asChild>
              <Link to="/signup">
                Créer mon profil gratuit
                <ArrowRight size={17} />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground hover:text-foreground rounded-full"
              asChild
            >
              <Link to="/comment-ca-marche">Comment ça marche ?</Link>
            </Button>
          </div>
        </motion.div>

      </div>
    </div>
  </section>
);

export default DualCTA;
