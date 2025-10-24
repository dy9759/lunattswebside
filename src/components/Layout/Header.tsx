'use client';

import { AppBar, Toolbar, Typography, Box, Chip, Avatar, Button } from '@mui/material';
import { Mic } from '@mui/icons-material';

const Header = () => {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'surfaceLight.main',
        borderBottom: 1,
        borderColor: 'borderLight.main',
        boxShadow: '0 1px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
         <img src="/icon.png" style={{width:24}}  alt="" />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: 'textLight.main',
              letterSpacing: '-0.025em'
            }}
          >
            LUNALABS
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Button color="inherit" sx={{ color: 'textLight.main' }}>
            首页
          </Button>
          <Button color="inherit" sx={{ color: 'subtleLight.main' }}>
            定价
          </Button>
          <Button color="inherit" sx={{ color: 'subtleLight.main' }}>
            API
          </Button>
          <Button color="inherit" sx={{ color: 'subtleLight.main' }}>
            关于
          </Button>
        </Box>

       
      </Toolbar>
    </AppBar>
  );
};

export default Header;