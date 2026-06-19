'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

export function Presentation() {
  // Personal information
  const profile = {
    name: 'Max Issaliyev',
    age: 'Product Manager',
    location: 'Munich, Germany',
    // Add a newline character after the emoji
    description:
      "Hi, I'm Max. 👋\nI'm a product person driven by curiosity and a stubborn need to make things work better, whether that's refining products at Amazon or building apps with startups. My background mixes management, hands-on product work, and a real love for making people's lives a little easier.\n\nI'm happiest in the messy middle, where business, tech, and actual user needs collide. If a feature doesn't solve a problem or pull people in, I keep iterating, because the products I'm proud of came from rolling up my sleeves, asking sharper questions, and actually listening, then turning what I heard into something real.\n\nMy path started where business and technology meet. Studying Management & Technology at TUM gave me the toolkit (analytics, market research, prototyping) and the itch to build for real people, not just slide decks. Amazon, VEON, and a handful of startups taught me the rest. So I stay curious: one day I'm mapping user flows in Figma, the next I'm running an experiment or buried in a spreadsheet, always working to get a product from napkin sketch to launch.",
    src: '/about-me.jpg',
    fallbackSrc:
      'https://images.unsplash.com/photo-1610216705422-caa3fcb6d158?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3',
  };

  // Animation variants for text elements
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  // Animation for the entire paragraph rather than word-by-word
  const paragraphAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
        delay: 0.2,
      },
    },
  };

  return (
    <div className="mx-auto w-full max-w-5xl py-6 font-sans after:table after:clear-both after:content-['']">
      {/* Image: floats left on md+ so the text wraps beside it and continues below */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className="relative mx-auto mb-6 aspect-square w-full max-w-sm overflow-hidden rounded-2xl md:float-left md:mx-0 md:mr-10 md:mb-4 md:w-80"
      >
        <Image
          src={profile.src}
          alt={profile.name}
          width={500}
          height={500}
          className="h-full w-full object-cover object-center"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = profile.fallbackSrc;
          }}
        />
      </motion.div>

      {/* Name + role */}
      <motion.div initial="hidden" animate="visible" variants={textVariants}>
        <h1 className="from-foreground to-muted-foreground bg-gradient-to-r bg-clip-text text-xl font-semibold text-transparent md:text-3xl">
          {profile.name}
        </h1>
        <div className="mt-1 flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
          <p className="text-muted-foreground">{profile.age}</p>
          <div className="bg-border hidden h-1.5 w-1.5 rounded-full md:block" />
          <p className="text-muted-foreground">{profile.location}</p>
        </div>
      </motion.div>

      {/* Bio — wraps to the right of the image, then flows full-width below it */}
      <motion.p
        initial="hidden"
        animate="visible"
        variants={paragraphAnimation}
        className="text-foreground mt-6 leading-relaxed whitespace-pre-line"
      >
        {profile.description}
      </motion.p>

      {/* Tags/Keywords */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-6 flex flex-wrap gap-2"
      >
        {['Product', 'AI Tooling', 'Data Analytics', 'TUM', 'Startup Builder'].map(
          (tag) => (
            <span
              key={tag}
              className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm"
            >
              {tag}
            </span>
          )
        )}
      </motion.div>
    </div>
  );
}

export default Presentation;
