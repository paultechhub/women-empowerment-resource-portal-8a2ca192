import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const SuccessStories = () => {
  const stories = [
    {
      name: "Sarah Johnson",
      role: "Tech Entrepreneur",
      quote: "This platform gave me the confidence and skills to launch my own tech startup. The mentorship was invaluable!",
    },
    {
      name: "Maria Garcia",
      role: "Digital Marketer",
      quote: "I went from knowing nothing about digital marketing to running successful campaigns for major brands.",
    },
    {
      name: "Aisha Patel",
      role: "Software Developer",
      quote: "The community support and learning resources helped me transition into a rewarding career in tech.",
    },
  ];

  return (
    <section className="py-20 px-6 relative">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Success Stories</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Real stories from women who transformed their careers and lives
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <Card 
              key={index}
              className="glass-card border-none hover:scale-105 transition-transform duration-300"
            >
              <CardContent className="p-8">
                <Quote className="w-10 h-10 text-accent mb-4" />
                <p className="text-foreground/90 mb-6 italic leading-relaxed">
                  "{story.quote}"
                </p>
                <div>
                  <div className="font-bold text-lg">{story.name}</div>
                  <div className="text-foreground/70">{story.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
