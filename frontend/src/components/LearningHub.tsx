import { BookOpen, Video, FileText, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const LearningHub = () => {
  const resources = [
    {
      icon: BookOpen,
      title: "Online Courses",
      description: "Access expert-led courses on digital skills, business, and technology",
      color: "text-accent"
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Learn at your own pace with comprehensive video content",
      color: "text-primary"
    },
    {
      icon: FileText,
      title: "E-books & Guides",
      description: "Download resources to support your learning journey",
      color: "text-accent"
    },
    {
      icon: Award,
      title: "Certifications",
      description: "Earn recognized certificates to advance your career",
      color: "text-primary"
    },
  ];

  return (
    <section className="py-20 px-6 relative">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Learning Hub</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Discover a wealth of resources designed to help you build skills and grow your digital business
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
            <Card 
              key={index} 
              className="glass-card border-none hover:scale-105 transition-transform duration-300"
            >
              <CardContent className="p-8 text-center">
                <resource.icon className={`w-12 h-12 mx-auto mb-4 ${resource.color}`} />
                <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                <p className="text-foreground/70">{resource.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningHub;
