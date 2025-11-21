import Header from "@/components/Header";
import AnimatedBackground from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";
import Community from "@/components/Community";

const CommunityPage = () => {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <AnimatedBackground />
      <Header />
      <main className="relative z-10 pt-32">
        <Community />
      </main>
      <Footer />
    </div>
  );
};

export default CommunityPage;
