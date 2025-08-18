'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-dark-bg py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
            Get in Touch
          </h1>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-dark-secondary p-6 rounded-lg border border-dark-border">
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Contact Information
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Mail className="text-primary-green mt-1" size={20} />
                    <div>
                      <p className="text-white font-medium">Email</p>
                      <a href="mailto:info@workfusion.pro" 
                         className="text-gray-400 hover:text-primary-green">
                        info@workfusion.pro
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Phone className="text-primary-green mt-1" size={20} />
                    <div>
                      <p className="text-white font-medium">Phone</p>
                      <a href="tel:+18774503224" 
                         className="text-gray-400 hover:text-primary-green">
                        +1 (877) 450-3224
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <MapPin className="text-primary-green mt-1" size={20} />
                    <div>
                      <p className="text-white font-medium">Address</p>
                      <p className="text-gray-400">
                        1239 120th NE AVE<br/>
                        Bellevue, WA - US
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Clock className="text-primary-green mt-1" size={20} />
                    <div>
                      <p className="text-white font-medium">Business Hours</p>
                      <p className="text-gray-400">
                        Monday - Friday: 9:00 AM - 6:00 PM PST
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Map placeholder */}
              <div className="bg-dark-secondary p-6 rounded-lg border border-dark-border h-64">
                {/* Adicione Google Maps ou Mapbox aqui */}
                <div className="w-full h-full bg-dark-bg rounded flex items-center justify-center">
                  <p className="text-gray-400">Map Integration</p>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-dark-secondary p-6 rounded-lg border border-dark-border">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Send us a Message
              </h2>
              
              <form className="space-y-4">
                {/* Form fields aqui */}
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}