import React, { useId } from 'react';
import { Box } from '@chakra-ui/react';

export default function AppIcon({ boxSize = 10, ...props }) {
  const id = useId().replace(/:/g, '');
  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      boxSize={boxSize}
      flexShrink={0}
      {...props}
    >
      <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="14" fill={`url(#ow-bg-${id})`} />
        <path
          d="M20 18h24v4H20V18zm0 8h24v2H20v-2zm0 6h16v2H20v-2z"
          fill="white"
          opacity="0.95"
        />
        <path d="M32 44l-4-4h3V32h2v8h3l-4 4z" fill="white" />
        <circle cx="44" cy="24" r="6" fill="#38B2AC" />
        <defs>
          <linearGradient id={`ow-bg-${id}`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2C7A7B" />
            <stop offset="1" stopColor="#319795" />
          </linearGradient>
        </defs>
      </svg>
    </Box>
  );
}
