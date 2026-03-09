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
    name: "Amadou Diallo",
    role: "CEO & Fondateur",
    bio: "Visionnaire passionné par la tech africaine",
    location: "Conakry",
    color: "from-primary to-primary/70",
    image: "",
  },
  {
    name: "Fatoumata Camara",
    role: "CTO",
    bio: "Experte en développement et architecture",
    location: "Conakry",
    color: "from-secondary to-secondary/70",
    image: "",
  },
  {
    name: "Ibrahim Konaté",
    role: "Head of Product",
    bio: "Designer UX/UI primé internationalement",
    location: "Kindia",
    color: "from-cta to-cta/70",
    image: "",
  },
];
