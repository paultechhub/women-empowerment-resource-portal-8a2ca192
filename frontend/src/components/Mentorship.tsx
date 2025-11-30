import { Users, Calendar, MessageCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const Mentorship = () => {
  const features = [
    {
      icon: Users,
      title: "Expert Mentors",
      description: "Connect with successful women in tech and business"
    },
    {
      icon: Calendar,
      title: "Flexible Scheduling",
      description: "Book sessions that fit your schedule"
    },
    {
      icon: MessageCircle,
      title: "1-on-1 Guidance",
      description: "Get personalized advice and support"
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Work together to achieve your objectives"
    },
  ];

  return (
    <section className="py-20 px-6 relative">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Mentorship Program
            </h2>
            <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
              Get guidance from experienced professionals who have walked the path you're on. 
              Our mentors are here to support your growth and help you navigate challenges in the digital world.
            </p>
            
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="glass-card p-3 rounded-xl">
                    <feature.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{feature.title}</h3>
                    <p className="text-foreground/70">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg rounded-full"
            >
              Find a Mentor
            </Button>
          </div>
          
          <div className="glass-card p-12 rounded-3xl">
            <div className="aspect-square bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl flex items-center justify-center">
              <Users className="w-32 h-32 text-foreground/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mentorship;
