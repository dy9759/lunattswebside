'use client';

import { Typography } from '@mui/material';

interface GenerationCounterProps {
  remaining: number;
}

export function GenerationCounter({ remaining }: GenerationCounterProps) {
  return (
    <Typography variant="body2" sx={{ color: 'subtleLight.main' }}>
      {remaining} generations remaining today
    </Typography>
  );
}