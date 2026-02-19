import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutHero3D from "@/components/about/AboutHero3D";
import Values3D from "@/components/about/Values3D";
import Timeline3D from "@/components/about/Timeline3D";
import Team3D from "@/components/about/Team3D";
import FAQ3D from "@/components/about/FAQ3D";
import Stats3D from "@/components/about/Stats3D";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16">
        <AboutHero3D />
        <Stats3D />
        <Values3D />
        {/* <Timeline3D /> */}
        <Team3D />
        <FAQ3D />
      </main>
      <Footer />
    </div>
  );
};

export default About;
