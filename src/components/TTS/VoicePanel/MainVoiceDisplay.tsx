'use client';

import { Card, Box, Typography } from '@mui/material';
import { Voice } from '../Types';

interface MainVoiceDisplayProps {
  voice: Voice;
  isSelected: boolean;
  onClick: () => void;
}

export default function MainVoiceDisplay({ voice, isSelected, onClick }: MainVoiceDisplayProps) {
  return (
    <Card
      onClick={onClick}
      sx={{
        position: 'relative',
        backgroundColor: 'transparent',
        borderRadius: 2,
        border: '1px solid',
        borderColor: isSelected ? 'primary.main' : 'borderLight.main',
        cursor: 'pointer',
        transition: 'all 0.3s',
        minHeight: 150,
        height: 180,
        flexShrink: 0,
        boxShadow: isSelected
          ? '0 0 0 2px rgba(255, 199, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.12)'
          : '0 2px 8px rgba(0, 0, 0, 0.08)',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      {/* Background image */}
      <Box
        component="img"
        src={voice.avatar}
        alt={voice.name}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
        }}
      />

  
      {/* Content overlay */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 3,
          p: 2,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        {/* Top section: title and icon together */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            marginBottom: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'semibold',
              color: 'white',
              borderRadius: 1,
              p: 0.25,
              textAlign: 'left',
              fontSize: '18px',
              wordBreak: 'break-word',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 'none',
            }}
          >
            {voice.name}
          </Typography>

          {/* Switch icon */}
          <Box
            sx={{
              width: 32,
              height: 24,
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 0.5,
            }}
          >
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="20" height="20" style={{ fill: '#ffffff' }}>
              <path d="M670.72 325.696L511.552 152l87.68-87.872 360.96 389.504L832 453.76v0.64H64V325.76h606.72z m-318.4 382.08l157.248 172.8-94.976 79.552L63.872 579.84l147.712-0.704v-0.128H960v128.768H352.32z"></path>
            </svg>
          </Box>
        </Box>

        {/* Bottom section: description text */}
        <Typography
          variant="body2"
          sx={{
            color: 'white',
            borderRadius: 1,
            p: 0.25,
            pt: 0.125,
            textAlign: 'left',
            fontSize: '12px',
            wordBreak: 'break-word',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis',
            alignSelf: 'flex-start',
          }}
        >
          {voice.description}
        </Typography>
      </Box>
    </Card>
  );
}