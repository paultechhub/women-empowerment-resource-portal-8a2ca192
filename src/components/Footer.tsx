import { Sparkles, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-primary/30 py-12 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-2xl font-bold">WE Portal</span>
            </div>
            <p className="text-foreground/70">
              Empowering women in the digital world through education, mentorship, and community.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Learning Hub</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Mentorship</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Community</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Stay Connected</h3>
            <div className="flex gap-4 mb-4">
              <a href="#" className="glass-card p-2 rounded-lg hover:bg-primary/20 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="glass-card p-2 rounded-lg hover:bg-primary/20 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="glass-card p-2 rounded-lg hover:bg-primary/20 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="glass-card p-2 rounded-lg hover:bg-primary/20 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <div className="flex items-center gap-2 text-foreground/70">
              <Mail className="w-5 h-5" />
              <span>contact@weportal.com</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary/30 pt-8 text-center text-foreground/70">
          <p>&copy; 2025 WE Portal. All rights reserved. Empowering women worldwide.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
