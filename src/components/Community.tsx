import { Heart, Lightbulb, TrendingUp, Zap } from "lucide-react";

const Community = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Supportive Network",
      description: "Build meaningful connections with like-minded women"
    },
    {
      icon: Lightbulb,
      title: "Knowledge Sharing",
      description: "Exchange ideas and learn from each other's experiences"
    },
    {
      icon: TrendingUp,
      title: "Growth Opportunities",
      description: "Access exclusive events, workshops, and collaborations"
    },
    {
      icon: Zap,
      title: "Stay Inspired",
      description: "Get motivated by success stories and achievements"
    },
  ];

  return (
    <section className="py-20 px-6 relative">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Be part of a vibrant community where women support, inspire, and empower each other
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="glass-card p-8 rounded-3xl text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-4">
                <benefit.icon className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-foreground/70">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Community;
