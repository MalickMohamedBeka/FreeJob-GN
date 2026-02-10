export interface Project {
  id: string;
  title: string;
  description: string;
  budget: { min: number; max: number; currency: string };
  skills: string[];
  proposalsCount: number;
  duration: string;
  postedAt: string;
  client: { name: string; avatar: string; verified: boolean };
  status: "open" | "in_progress" | "completed";
}

export interface Freelancer {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  currency: string;
  skills: string[];
  completedProjects: number;
  location: string;
  available: boolean;
  bio: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}
