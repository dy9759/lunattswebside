'use client';

import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon
} from '@mui/icons-material';

const Header = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'transparent',
        backdropFilter: 'none',
        border: 'none',
        boxShadow: 'none',
        py: 2,
      }}
    >
      <Toolbar sx={{ justifyContent: 'center', minHeight: 'auto', py: 0 }}>
        {/* 椭圆形Header容器 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: { xs: '95%', sm: '90%', md: '85%' },
            maxWidth: '900px',
            height: { xs: '70px', sm: '80px', md: '90px' },
            background: theme.palette.backgroundLight.main,
            borderRadius: '9999px !important',
            backdropFilter: 'blur(10px)',
            border: 'none',
            boxShadow: '0 0.8px 1.5px rgba(0, 0, 0, 0.09)',
            px: { xs: 3, sm: 4, md: 5 },
            position: 'relative',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              backgroundColor: alpha(theme.palette.backgroundLight.main, 0.8),
            },
          }}
        >
          {/* Logo区域 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
            <img
              src="/icon.png"
              style={{
                width: 24,
                height: 24,
                borderRadius: '6px'
              }}
              alt="LUNALABS Logo"
            />
            <Typography
              variant="h6"
              className="typeless-icon-text"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.025em',
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.3rem' },
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              LunaTTS
            </Typography>
          </Box>

          {/* 主导航菜单 - 桌面端 */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 0.5,
            flex: 1,
            justifyContent: 'center',
            mx: 3
          }}>
            <Button
              size="small"
              sx={{
                color: theme.palette.textLight.main,
                fontWeight: 600,
                px: 2,
                py: 0.8,
                borderRadius: '20px',
                textTransform: 'none',
                fontSize: '14px',
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Homepage
            </Button>
            <Button
              size="small"
              sx={{
                color: theme.palette.subtleLight.main,
                fontWeight: 500,
                px: 2,
                py: 0.8,
                borderRadius: '20px',
                textTransform: 'none',
                fontSize: '14px',
                minWidth: 'auto',
                '&:hover': {
                  color: theme.palette.textLight.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Pricing
            </Button>
            <Button
              size="small"
              sx={{
                color: theme.palette.subtleLight.main,
                fontWeight: 500,
                px: 2,
                py: 0.8,
                borderRadius: '20px',
                textTransform: 'none',
                fontSize: '14px',
                minWidth: 'auto',
                '&:hover': {
                  color: theme.palette.textLight.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              About
            </Button>
          </Box>

          {/* 右侧功能区 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {/* 移动端菜单 */}
            <IconButton
              onClick={handleMobileMenu}
              size="small"
              sx={{
                color: theme.palette.textLight.main,
                display: { xs: 'flex', md: 'none' },
                width: 32,
                height: 32,
              }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>

  
      {/* 移动端菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: alpha(theme.palette.grey[900], 0.95),
            color: 'white',
            borderRadius: '16px',
            mt: 1,
            minWidth: 200,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }
        }}
      >
        <MenuItem onClick={handleClose}>homepage</MenuItem>
        <MenuItem onClick={handleClose}>Pricing</MenuItem>
        <MenuItem onClick={handleClose}>about</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;