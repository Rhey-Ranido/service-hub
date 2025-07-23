import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Home, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Send,
  Heart,
  Shield,
  Users,
  Star
} from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription submitted');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">ServiceHub</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting you with skilled service providers for all your needs. 
              Quality, reliability, and trust in every service.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigation('/')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/services')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Browse Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/providers')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Find Providers
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/about')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/contact')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Support & Legal</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigation('/help')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/safety')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Safety Guidelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/terms')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/privacy')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/cookies')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Stay Connected</h4>
            <p className="text-gray-400 text-sm">
              Subscribe to get updates on new services and features.
            </p>
            
            {/* Newsletter signup */}
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-r-none focus:border-primary"
                  required
                />
                <Button
                  type="submit"
                  className="rounded-l-none px-3"
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Contact info */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                <span>support@servicehub.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Phone className="h-4 w-4" />
                <span>1-800-SERVICE</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust indicators */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Verified Providers</p>
                <p className="text-xs text-gray-400">Background checked</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">50,000+ Users</p>
                <p className="text-xs text-gray-400">Trusted community</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">4.9/5 Rating</p>
                <p className="text-xs text-gray-400">Customer satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span>© {currentYear} ServiceHub. Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for connecting people.</span>
            </div>
            
            <div className="flex items-center space-x-6 text-xs text-gray-500">
              <button
                onClick={() => handleNavigation('/accessibility')}
                className="hover:text-gray-300 transition-colors"
              >
                Accessibility
              </button>
              <button
                onClick={() => handleNavigation('/sitemap')}
                className="hover:text-gray-300 transition-colors"
              >
                Sitemap
              </button>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 