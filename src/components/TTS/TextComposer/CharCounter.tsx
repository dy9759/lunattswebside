'use client';

import { Typography } from '@mui/material';

interface CharCounterProps {
  currentLength: number;
  maxLength: number;
}

export function CharCounter({ currentLength, maxLength }: CharCounterProps) {
  return (
    <Typography variant="body2" sx={{ color: 'subtleLight.main' }}>
      {currentLength} / {maxLength} characters
    </Typography>
  );
}