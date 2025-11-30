import { Sparkles, User as UserIcon, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import NotificationCenter from "@/components/NotificationCenter";
import { motion } from "framer-motion";

const Header = () => {
  const { user, signOut, isAdmin } = useAuth();
  
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-2xl font-bold text-foreground">WE Portal</span>
          </NavLink>
          
          <nav className="hidden md:flex items-center gap-8">
            <NavLink 
              to="/" 
              className="text-foreground/80 hover:text-foreground transition-colors"
              activeClassName="text-foreground font-semibold"
            >
              Home
            </NavLink>
            <NavLink 
              to="/courses" 
              className="text-foreground/80 hover:text-foreground transition-colors"
              activeClassName="text-foreground font-semibold"
            >
              Courses
            </NavLink>
            <NavLink 
              to="/learning-hub" 
              className="text-foreground/80 hover:text-foreground transition-colors"
              activeClassName="text-foreground font-semibold"
            >
              Resources
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
              to="/jobs" 
              className="text-foreground/80 hover:text-foreground transition-colors"
              activeClassName="text-foreground font-semibold"
            >
              Jobs
            </NavLink>
            {isAdmin && (
              <NavLink 
                to="/admin" 
                className="text-foreground/80 hover:text-foreground transition-colors"
                activeClassName="text-foreground font-semibold"
              >
                Admin
              </NavLink>
            )}
          </nav>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <NotificationCenter />
                <Button variant="ghost" size="icon">
                  <MessageCircle className="w-5 h-5" />
                </Button>
                <NavLink to="/profile">
                  <Button variant="ghost" className="text-foreground hover:bg-primary/10">
                    <UserIcon className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </NavLink>
                <Button 
                  variant="outline" 
                  onClick={signOut}
                  className="border-2 border-primary/50 hover:bg-primary/10"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/auth">
                  <Button variant="ghost" className="text-foreground hover:bg-primary/10">
                    Sign In
                  </Button>
                </NavLink>
                <NavLink to="/auth">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Get Started
                  </Button>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
