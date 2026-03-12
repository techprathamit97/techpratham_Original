'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Award, BookOpen, TrendingUp } from 'lucide-react';

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  delay: number;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, label, suffix = '', delay }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="relative group"
    >
      <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
        {/* Icon with gradient background */}
        <div className="mb-6 relative">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
            <div className="text-white">
              {icon}
            </div>
          </div>
          {/* Decorative circle */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-300"></div>
        </div>

        {/* Counter */}
        <div className="mb-2">
          <span className="text-5xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            {count.toLocaleString()}
            {suffix}
          </span>
        </div>

        {/* Label */}
        <p className="text-gray-600 font-medium text-lg">
          {label}
        </p>

        {/* Decorative line */}
        <div className="mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r from-red-500 to-red-700 transition-all duration-500 rounded-full"></div>
      </div>
    </motion.div>
  );
};

const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: <Users size={32} />,
      value: 10000,
      label: 'Students Trained',
      suffix: '+',
    },
    {
      icon: <Award size={32} />,
      value: 35,
      label: 'Years of Experience',
      suffix: '+',
    },
    {
      icon: <BookOpen size={32} />,
      value: 180,
      label: 'Courses Offered',
      suffix: '+',
    },
    {
      icon: <TrendingUp size={32} />,
      value: 95,
      label: 'Placement Rate',
      suffix: '%',
    },
  ];

  return (
    <section className="w-full py-20 px-4 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-100 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-100 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Our Impact in Numbers
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Transforming careers and shaping futures through quality education and industry expertise
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
