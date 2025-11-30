import Header from "@/components/Header";
import AnimatedBackground from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";
import Mentorship from "@/components/Mentorship";

const MentorshipPage = () => {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <AnimatedBackground />
      <Header />
      <main className="relative z-10 pt-32">
        <Mentorship />
      </main>
      <Footer />
    </div>
  );
};

export default MentorshipPage;
