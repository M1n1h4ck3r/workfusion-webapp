'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, Zap, Crown, Rocket, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for testing and small projects",
    price: "Free",
    originalPrice: null,
    period: "Always",
    tokens: "500",
    icon: Zap,
    popular: false,
    color: "green",
    features: [
      "500 free tokens monthly",
      "Access to all AI chatbots",
      "Basic WhatsApp integration",
      "Text-to-speech (3 voices)",
      "Community support",
      "API access (limited)"
    ],
    limitations: [
      "Limited to 100 requests/day",
      "Basic voice quality",
      "Email support only"
    ]
  },
  {
    name: "Professional",
    description: "For growing businesses and teams",
    price: "29",
    originalPrice: "49",
    period: "month",
    tokens: "5,000",
    icon: Crown,
    popular: true,
    color: "yellow",
    features: [
      "5,000 tokens monthly",
      "All AI chatbots + custom training",
      "Advanced WhatsApp automation",
      "Premium text-to-speech (10+ voices)",
      "Phone call testing",
      "Priority support",
      "Full API access",
      "Analytics dashboard",
      "Custom integrations"
    ],
    limitations: []
  },
  {
    name: "Enterprise",
    description: "For large teams and organizations",
    price: "99",
    originalPrice: "149",
    period: "month",
    tokens: "25,000",
    icon: Rocket,
    popular: false,
    color: "orange",
    features: [
      "25,000 tokens monthly",
      "Custom AI model training",
      "White-label solutions",
      "Advanced analytics & reporting",
      "Dedicated account manager",
      "24/7 priority support",
      "Custom voice training",
      "Enterprise security",
      "SLA guarantee",
      "On-premise deployment"
    ],
    limitations: []
  }
]

const tokenPackages = [
  { amount: "1,000", price: "9.99", bonus: "0" },
  { amount: "5,000", price: "39.99", bonus: "500", popular: true },
  { amount: "10,000", price: "69.99", bonus: "1,500" },
  { amount: "25,000", price: "149.99", bonus: "5,000" }
]

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [flippedCard, setFlippedCard] = useState<number | null>(null)

  const handleCardFlip = (index: number) => {
    setFlippedCard(flippedCard === index ? null : index)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 mesh-gradient opacity-20" />
      </div>

      <div className="container mx-auto relative z-10 max-w-8xl px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-primary-yellow/20 text-primary-yellow border-primary-yellow/30">
            💳 Pricing Plans
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Choose Your <span className="gradient-text">AI Journey</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
            Start free with 500 tokens, then scale with flexible plans designed for every business size.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-white/60'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isAnnual ? 'bg-primary-green' : 'bg-white/20'
              }`}
            >
              <motion.div
                className="w-5 h-5 bg-white rounded-full absolute top-1"
                animate={{ x: isAnnual ? 32 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-white' : 'text-white/60'}`}>
              Annual
            </span>
            {isAnnual && (
              <Badge className="bg-primary-green/20 text-primary-green border-primary-green/30">
                Save 30%
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16 xl:gap-20 mb-32">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className="relative perspective-1000"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div
                className={`relative w-full h-full preserve-3d cursor-pointer ${
                  plan.popular ? 'scale-[1.02]' : ''
                }`}
                animate={{ rotateY: flippedCard === index ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                onClick={() => handleCardFlip(index)}
                whileHover={{ scale: plan.popular ? 1.03 : 1.01 }}
              >
                {/* Front of card */}
                <div className={`absolute inset-0 w-full h-full backface-hidden ${
                  plan.popular 
                    ? 'glass-strong border-2 border-primary-yellow/50' 
                    : 'glass border border-white/10'
                } p-8 rounded-2xl`}>
                  
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary-yellow text-black font-semibold px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <motion.div 
                      className={`w-16 h-16 bg-gradient-to-r ${
                        plan.color === 'green' ? 'from-green-400 to-emerald-500' :
                        plan.color === 'yellow' ? 'from-yellow-400 to-orange-500' :
                        'from-orange-400 to-red-500'
                      } rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <plan.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {plan.description}
                    </p>
                  </div>

                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center">
                      {plan.originalPrice && (
                        <span className="text-white/40 line-through text-lg mr-2">
                          ${isAnnual ? Math.round(Number(plan.originalPrice) * 10) : plan.originalPrice}
                        </span>
                      )}
                      <span className="text-4xl font-bold gradient-text">
                        {plan.price === "Free" ? "Free" : `$${isAnnual ? Math.round(Number(plan.price) * 10) : plan.price}`}
                      </span>
                      {plan.price !== "Free" && (
                        <span className="text-white/60 ml-1">
                          /{isAnnual ? 'year' : plan.period}
                        </span>
                      )}
                    </div>
                    <div className="text-primary-green text-sm font-medium mt-2">
                      {plan.tokens} tokens included
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.slice(0, 6).map((feature, featureIndex) => (
                      <motion.li 
                        key={featureIndex} 
                        className="flex items-center text-sm text-white/80"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: featureIndex * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Check className="h-4 w-4 text-primary-green mr-3 flex-shrink-0" />
                        {feature}
                      </motion.li>
                    ))}
                    {plan.features.length > 6 && (
                      <li className="text-primary-green text-sm cursor-pointer hover:underline">
                        +{plan.features.length - 6} more features...
                      </li>
                    )}
                  </ul>

                  <Link href={plan.name === "Starter" ? "/auth/register" : "/dashboard/billing"}>
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'btn-primary' 
                          : 'glass text-white border-white/20 hover:bg-white/10'
                      } group`}
                    >
                      {plan.name === "Starter" ? "Get Started Free" : "Choose Plan"}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>

                {/* Back of card */}
                <div className={`absolute inset-0 w-full h-full backface-hidden glass-strong p-8 rounded-2xl`}
                     style={{ transform: 'rotateY(180deg)' }}>
                  
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-white mb-4">
                      {plan.name} Details
                    </h4>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="text-white font-semibold mb-2">All Features:</h5>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-white/80">
                            <Check className="h-3 w-3 text-primary-green mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {plan.limitations.length > 0 && (
                      <div>
                        <h5 className="text-white font-semibold mb-2">Limitations:</h5>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, idx) => (
                            <li key={idx} className="text-sm text-white/60">
                              • {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <Button 
                    variant="outline"
                    className="w-full mt-6 glass text-white border-white/20 hover:bg-white/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCardFlip(index)
                    }}
                  >
                    Back to Plan
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Token Packages */}
        <div className="mt-96 pt-64">
          <motion.div
            className="glass-strong p-8 md:p-12 rounded-3xl relative z-10"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Need More <span className="gradient-text">Tokens</span>?
              </h3>
              <p className="text-white/70">
                Purchase additional tokens at any time with our flexible top-up packages.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {tokenPackages.map((pkg, index) => (
                <motion.div
                  key={index}
                  className={`glass p-8 rounded-xl text-center ${
                    pkg.popular ? 'border-2 border-primary-yellow/50' : ''
                  }`}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {pkg.popular && (
                    <Badge className="mb-3 bg-primary-yellow text-black">
                      Best Value
                    </Badge>
                  )}
                  <div className="text-2xl font-bold gradient-text mb-2">
                    {pkg.amount}
                  </div>
                  <div className="text-white/60 text-sm mb-2">
                    tokens
                  </div>
                  {pkg.bonus !== "0" && (
                    <div className="text-primary-green text-sm font-medium mb-3">
                      +{pkg.bonus} bonus tokens
                    </div>
                  )}
                  <div className="text-xl font-semibold text-white mb-6">
                    ${pkg.price}
                  </div>
                  <Button size="sm" variant="outline" className="w-full glass text-white border-white/20 hover:bg-white/10">
                    Buy Now
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-white mb-4">
            Have Questions?
          </h3>
          <p className="text-white/70 mb-6">
            Our team is here to help you choose the perfect plan for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#">
              <Button className="btn-primary">
                Contact Sales
              </Button>
            </Link>
            <Link href="#">
              <Button variant="outline" className="glass text-white border-white/20 hover:bg-white/10">
                View FAQ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}