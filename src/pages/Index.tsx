import Header from "@/components/Header";
import AnimatedBackground from "@/components/AnimatedBackground";
import Hero from "@/components/Hero";
import MarqueeText from "@/components/MarqueeText";
import LearningHub from "@/components/LearningHub";
import Mentorship from "@/components/Mentorship";
import Community from "@/components/Community";
import SuccessStories from "@/components/SuccessStories";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <AnimatedBackground />
      <Header />
      <main className="relative z-10">
        <Hero />
        <MarqueeText />
        <LearningHub />
        <Mentorship />
        <Community />
        <SuccessStories />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
