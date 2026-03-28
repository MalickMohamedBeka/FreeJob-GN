import gastonPascal from "@/assets/gaston-pascal.jpeg";
import mamadouElhadji from "@/assets/mamadou-elhadji.png";
import mamadouSire from "@/assets/mamadou-sire.png";
import aboubacarSidiki from "@/assets/aboubacar-sidiki.png";

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  location: string;
  color: string;
  /** Path to photo, e.g. "/team/amadou.jpg". Leave empty to show SVG silhouette. */
  image: string;
}

export const team: TeamMember[] = [
  {
    name: "TONGUINO Gaston Pascal",
    role: "Dev Frontend",
    bio: "Développeur frontend passionné par les interfaces modernes et l'expérience utilisateur",
    location: "Conakry",
    color: "from-primary to-primary/70",
    image: gastonPascal,
  },
  {
    name: "Elhadj Mamadou Diallo",
    role: "Dev Backend / DevOps",
    bio: "Expert en développement backend et infrastructure cloud",
    location: "Conakry",
    color: "from-secondary to-secondary/70",
    image: mamadouElhadji,
  },
  {
    name: "Mamadou Sire Diallo",
    role: "Dev Backend",
    bio: "Développeur backend spécialisé dans les architectures scalables",
    location: "Conakry",
    color: "from-cta to-cta/70",
    image: mamadouSire,
  },
  {
    name: "Aboubacar Sidiki Koné",
    role: "Responsable de la Communication",
    bio: "Stratège en communication digitale et développement de la communauté",
    location: "Conakry",
    color: "from-primary/80 to-secondary/70",
    image: aboubacarSidiki,
  },
];
