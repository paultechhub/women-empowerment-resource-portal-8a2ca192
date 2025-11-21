import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-2xl font-bold text-foreground">WE Portal</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <NavLink 
              to="/" 
              className="text-foreground/80 hover:text-foreground transition-colors"
              activeClassName="text-foreground font-semibold"
            >
              Home
            </NavLink>
            <NavLink 
              to="/learning-hub" 
              className="text-foreground/80 hover:text-foreground transition-colors"
              activeClassName="text-foreground font-semibold"
            >
              Learning Hub
            </NavLink>
            <NavLink 
              to="/mentorship" 
              className="text-foreground/80 hover:text-foreground transition-colors"
              activeClassName="text-foreground font-semibold"
            >
              Mentorship
            </NavLink>
            <NavLink 
              to="/community" 
              className="text-foreground/80 hover:text-foreground transition-colors"
              activeClassName="text-foreground font-semibold"
            >
              Community
            </NavLink>
            <NavLink 
              to="/success-stories" 
              className="text-foreground/80 hover:text-foreground transition-colors"
              activeClassName="text-foreground font-semibold"
            >
              Success Stories
            </NavLink>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-foreground hover:bg-primary/10">
              Sign In
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
