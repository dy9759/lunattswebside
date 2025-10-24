'use client';

import { Button, useTheme } from '@mui/material';

interface GenerateButtonProps {
  onGenerate: () => void;
  disabled: boolean;
}

export function GenerateButton({ onGenerate, disabled }: GenerateButtonProps) {
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      onClick={onGenerate}
      disabled={disabled}
      sx={{
        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        color: 'white',
        fontWeight: 'bold',
        py: 2,
        px: 4,
        borderRadius: 8,
        boxShadow: '0 4px 15px rgba(255, 199, 0, 0.3)',
        border: 'none',
        textTransform: 'none',
        fontSize: '16px',
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
          transition: 'left 0.5s',
        },
        '&:hover': {
          background: 'linear-gradient(45deg, #B38B00, #FF6B35)',
          transform: 'scale(1.05) translateY(-2px)',
          boxShadow: '0 8px 25px rgba(255, 199, 0, 0.4)',
          '&:before': {
            left: '100%',
          },
        },
        '&:active': {
          transform: 'scale(1.02) translateY(-1px)',
          boxShadow: '0 4px 15px rgba(255, 199, 0, 0.3)',
        },
        '&:disabled': {
          background: 'linear-gradient(45deg, #9CA3AF, #6B7280)',
          color: '#E5E7EB',
          transform: 'none',
          boxShadow: 'none',
          '&:hover': {
            transform: 'none',
            boxShadow: 'none',
            '&:before': {
              left: '-100%',
            },
          },
        },
        transition: 'all 0.3s ease',
      }}
    >
      Generate
    </Button>
  );
}