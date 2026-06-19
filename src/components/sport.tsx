'use client';

import React from 'react';
import { Photos, PhotoItem } from './photos';

const Sports = () => {
  // NOTE: replace these placeholder image paths with your own screenshots /
  // photos in /public (gaming clips, F1 weekends, setup, etc.)
  const sportPhotos: PhotoItem[] = [
    {
      src: '/hobby-deadlock.png',
      alt: 'Playing Deadlock',
      caption: 'Grinding ranked in Deadlock, my current main',
    },
    {
      src: '/hobby-dota.png',
      alt: 'Playing Dota 2',
      caption: 'Late-night Dota 2 sessions with friends',
    },
    {
      src: '/hobby-thefinals.png',
      alt: 'Playing The Finals',
      caption: 'Going for the win in The Finals',
    },
    {
      src: '/hobby-f1.png',
      alt: 'Watching Formula 1',
      caption: 'Race weekend, always cheering for Mercedes 🏎️',
    },
  ];

  return (
    <div className="mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-foreground text-3xl font-semibold md:text-4xl">
          Outside of Work
        </h2>
        <p className="mt-4 text-muted-foreground">
          When I'm not building products or vibecoding, you'll find me deep in a
          game of Deadlock, Dota 2, or The Finals, or glued to a Formula 1 race
          weekend cheering for Mercedes. Here are a few highlights from the fun
          side of life.
        </p>
      </div>
      <Photos photos={sportPhotos} />
    </div>
  );
};

export default Sports;