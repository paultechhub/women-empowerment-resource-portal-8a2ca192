import Header from "@/components/Header";
import AnimatedBackground from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";
import SuccessStories from "@/components/SuccessStories";
import ExpressSuccessStories from "@/components/ExpressSuccessStories";

const SuccessStoriesPage = () => {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <AnimatedBackground />
      <Header />
      <main className="relative z-10 pt-32">
        <SuccessStories />
        <ExpressSuccessStories />
      </main>
      <Footer />
    </div>
  );
};

export default SuccessStoriesPage;
