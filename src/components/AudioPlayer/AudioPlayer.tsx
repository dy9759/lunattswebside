'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Avatar,
  IconButton,
  Typography,
  LinearProgress,
  Slider,
} from '@mui/material';
import {
  PlayCircle,
  PauseCircle,
  Download,
} from '@mui/icons-material';

interface AudioPlayerProps {
  currentVoice?: {
    name: string;
    avatar: string;
  };
  audioUrl?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentVoice = {
    name: 'Storyteller',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqDTmRxce4NpOUiQPfRpPS1WJWQd12k6KhoO7sxELYV4W9plR-wwRd7QhbJ40kP6dLOdhJgLjC6EeBA8UVOtuqSds0CSebRQZROYruXs3kB89ovRGf_rrKI10amndrMpgNgJ1WYhxxOn87Hihxoc2FZmsRzpO-IvruKEJtOGE-Q-xq8fLX8hyIyLORo9-n39EXbUgEq7THgXM4hNDs4U5FRu1w98jR5Wu37qpEOIZloFkOWVBzR4wvVvHYDJ-DjaBwGdF15HU4F2DJ',
  },
  audioUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 初始化音频元素
  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
      };
    }
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (event: Event, newValue: number | number[]) => {
    const newTime = Array.isArray(newValue) ? newValue[0] : newValue;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `${currentVoice.name}_audio.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressValue = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(16px)',
        borderTop: 1,
        borderColor: 'borderLight.main',
        boxShadow: 3,
        p: 2,
        zIndex: 1000,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, maxWidth: 1200, mx: 'auto' }}>
        {/* Voice Avatar */}
        <Avatar
          src={currentVoice.avatar}
          sx={{
            width: 48,
            height: 48,
            // 恢复为圆形（默认50%）
            boxShadow: '0 0 0 3px #FFC700, 0 0 15px 5px rgba(255, 199, 0, 0.5)',
          }}
        />

        {/* Voice Name */}
        <Typography
          variant="body1"
          sx={{
            fontWeight: 'semibold',
            color: 'textLight.main',
            display: { xs: 'none', sm: 'block' },
            minWidth: 100,
          }}
        >
          {currentVoice.name}
        </Typography>

        {/* Play/Pause Button */}
        <IconButton
          onClick={togglePlayPause}
          sx={{
            color: 'primary.main',
            '&:hover': {
              transform: 'scale(1.1)',
            },
            transition: 'transform 0.2s',
          }}
        >
          {isPlaying ? (
            <PauseCircle sx={{ fontSize: 48 }} />
          ) : (
            <PlayCircle sx={{ fontSize: 48 }} />
          )}
        </IconButton>

        {/* Current Time */}
        <Typography
          variant="body2"
          sx={{
            color: 'subtleLight.main',
            fontFamily: 'monospace',
            minWidth: 45,
          }}
        >
          {formatTime(currentTime)}
        </Typography>

        {/* Progress Bar */}
        <Box sx={{ flexGrow: 1, position: 'relative' }}>
          <Slider
            value={currentTime}
            max={duration || 100}
            onChange={handleSeek}
            sx={{
              color: 'primary.main',
              height: 8,
              '& .MuiSlider-track': {
                border: 'none',
              },
              '& .MuiSlider-thumb': {
                width: 16,
                height: 16,
                backgroundColor: 'white',
                border: '2px solid currentColor',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 8px rgba(255, 199, 0, 0.16)',
                },
                '&.Mui-active': {
                  boxShadow: '0 0 0 12px rgba(255, 199, 0, 0.16)',
                },
              },
              '& .MuiSlider-rail': {
                opacity: 0.3,
                backgroundColor: 'grey.400',
              },
            }}
          />
        </Box>

        {/* Duration */}
        <Typography
          variant="body2"
          sx={{
            color: 'subtleLight.main',
            fontFamily: 'monospace',
            minWidth: 45,
          }}
        >
          {formatTime(duration)}
        </Typography>

        {/* Download Button */}
        <IconButton
          onClick={handleDownload}
          disabled={!audioUrl}
          sx={{
            color: audioUrl ? 'subtleLight.main' : 'grey.400',
            '&:hover': {
              color: audioUrl ? 'primary.main' : 'grey.400',
            },
          }}
        >
          <Download />
        </IconButton>
      </Box>

      {/* Hidden audio element for playback */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
          style={{ display: 'none' }}
        />
      )}
    </Box>
  );
};

export default AudioPlayer;