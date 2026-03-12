'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Heart, Zap, Shield, Rocket } from 'lucide-react';

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const ValueCard: React.FC<ValueCardProps> = ({ icon, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group relative"
    >
      <div className="h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
              <div className="text-white">
                {icon}
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-red-600 transition-colors duration-300">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>

          {/* Decorative element */}
          <div className="mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r from-red-500 to-red-700 transition-all duration-500 rounded-full"></div>
        </div>

        {/* Background pattern */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </motion.div>
  );
};

const ValuesSection: React.FC = () => {
  const values = [
    {
      icon: <Target size={32} />,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from curriculum design to student support, ensuring the highest quality of education.',
    },
    {
      icon: <Lightbulb size={32} />,
      title: 'Innovation',
      description: 'We embrace cutting-edge technologies and innovative teaching methods to prepare students for the future of work.',
    },
    {
      icon: <Heart size={32} />,
      title: 'Student-Centric',
      description: 'Our students are at the heart of everything we do. We are committed to their success and personal growth.',
    },
    {
      icon: <Zap size={32} />,
      title: 'Practical Learning',
      description: 'We believe in hands-on, practical training that bridges the gap between theory and real-world application.',
    },
    {
      icon: <Shield size={32} />,
      title: 'Integrity',
      description: 'We maintain the highest standards of integrity, transparency, and ethical conduct in all our operations.',
    },
    {
      icon: <Rocket size={32} />,
      title: 'Growth Mindset',
      description: 'We foster a culture of continuous learning, adaptability, and personal development for lasting success.',
    },
  ];

  return (
    <section className="w-full py-20 px-4 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-red-100 rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-red-100 rounded-full filter blur-3xl opacity-10"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-red-600 font-semibold text-sm uppercase tracking-wider mb-2 block">
            Our Core Values
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            What Drives Us Forward
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Our values are the foundation of our commitment to delivering exceptional IT education and empowering the next generation of tech professionals
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <ValueCard
              key={index}
              icon={value.icon}
              title={value.title}
              description={value.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
