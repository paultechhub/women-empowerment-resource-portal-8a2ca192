import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
      <div className="container mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card mb-8 animate-float">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Empowering the Next Generation</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow leading-tight">
          Unlock Your Potential in the
          <br />
          Digital World
        </h1>
        
        <p className="text-lg md:text-xl text-foreground/90 max-w-3xl mx-auto mb-12 leading-relaxed">
          Join a vibrant community of women breaking barriers in technology, business, and digital innovation. 
          Access resources, mentorship, and opportunities to thrive in the digital economy.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button 
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg rounded-full group"
          >
            Join the Community
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="px-8 py-6 text-lg rounded-full border-2 border-primary/50 hover:bg-primary/10"
          >
            Explore Resources
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="glass-card p-8 rounded-3xl hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-bold mb-2">10K+</div>
            <div className="text-foreground/80">Women Empowered</div>
          </div>
          <div className="glass-card p-8 rounded-3xl hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-bold mb-2">500+</div>
            <div className="text-foreground/80">Resources Available</div>
          </div>
          <div className="glass-card p-8 rounded-3xl hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-bold mb-2">50+</div>
            <div className="text-foreground/80">Expert Mentors</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
