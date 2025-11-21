import Header from "@/components/Header";
import AnimatedBackground from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";
import LearningHub from "@/components/LearningHub";

const LearningHubPage = () => {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <AnimatedBackground />
      <Header />
      <main className="relative z-10 pt-32">
        <LearningHub />
      </main>
      <Footer />
    </div>
  );
};

export default LearningHubPage;
