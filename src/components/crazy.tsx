'use client';

import React from 'react';
import { Photos, PhotoItem } from './photos';

const Crazy = () => {
  // NOTE: replace with your own photo in /public (e.g. moving day, TUM campus)
  const crazyPhotos: PhotoItem[] = [
    {
      src: '/crazy-move.png',
      alt: 'Moving from Kazakhstan to Germany',
      caption: 'The big restart — Kazakhstan to Germany',
    },
  ];

  return (
    <div className="mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-foreground text-3xl font-semibold md:text-4xl">
          Betting on Myself
        </h2>
        <p className="mt-4 text-muted-foreground">
          The boldest thing I've done? Leaving a Software Engineering degree
          halfway through in Astana and restarting from scratch in Germany —
          new country, new language, new field (Management & Technology at TUM).
          No safety net, just a bet that I could build something bigger here.
          Three years in, it's paying off.
        </p>
      </div>
      <Photos photos={crazyPhotos} />
    </div>
  );
};

export default Crazy;