'use client';

import { Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';

export function SampleButton() {
  const handleSampleSentences = () => {
    // TODO: 实现范例句子功能
    console.log('Load sample sentences');
  };

  return (
    <Button
      startIcon={<Refresh />}
      onClick={handleSampleSentences}
      sx={{
        color: 'primary.main',
        fontWeight: 'medium',
        '&:hover': {
          color: 'primary.dark',
        },
      }}
    >
      Sample Sentences
    </Button>
  );
}