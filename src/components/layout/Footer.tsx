import Link from 'next/link'
import Image from 'next/image'
import { Github, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  const socialLinks = [
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
  ]

  const quickLinks = [
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'AI Playground', href: '/playground' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ]

  const legalLinks = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
    { name: 'GDPR Compliance', href: '#' },
  ]

  return (
    <footer className="bg-dark-surface border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative w-10 h-10">
                <Image
                  src="/workfusionlogo.png"
                  alt="Workfusion Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold gradient-text">Workfusion.pro</h3>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Transforming businesses with cutting-edge AI solutions. 
              Experience the future of automation, communication, and data analysis.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-white/60 hover:text-green-400 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <div className="space-y-3">
              <a 
                href="mailto:info@workfusion.pro" 
                className="flex items-center space-x-3 text-white/60 hover:text-green-400 transition-colors duration-200 group"
              >
                <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm">info@workfusion.pro</span>
              </a>
              <a 
                href="tel:+18774503224" 
                className="flex items-center space-x-3 text-white/60 hover:text-green-400 transition-colors duration-200 group"
              >
                <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm">+1 (877) 450-3224</span>
              </a>
              <div className="flex items-start space-x-3 text-white/60">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p>1239 120th NE AVE</p>
                  <p>Bellevue, WA - US</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-white/60 hover:text-green-400 transition-colors duration-200 text-sm block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal & Compliance */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-white/60 hover:text-green-400 transition-colors duration-200 text-sm block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <p className="text-xs text-white/40">
                LGPD/GDPR Compliant
              </p>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/60 text-sm">
              <p>&copy; {currentYear} Workfusion.pro. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-4 text-xs text-white/40">
              <span>Made with</span>
              <div className="flex items-center space-x-1">
                <span className="text-green-400">♥</span>
                <span>by Workfusion Team</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}