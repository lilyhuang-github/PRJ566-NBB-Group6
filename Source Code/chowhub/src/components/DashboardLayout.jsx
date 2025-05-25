import { useAtomValue, useSetAtom } from 'jotai';
import { tokenAtom, userAtom } from '@/store/atoms';
import { useRouter } from 'next/router';
import {
  Tabs,
  Tab,
  Box,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Container,
  Badge,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  MenuBook as MenuIcon,
  Inventory as InventoryIcon,
  BarChart as SalesIcon,
  AccessTime as ShiftsIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccessAlarm as AttendanceIcon,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import logo from '/public/images/logo.png';

export default function DashboardLayout({ children }) {
  const user = useAtomValue(userAtom);
  const token = useAtomValue(tokenAtom);
  const setUser = useSetAtom(userAtom);
  const setToken = useSetAtom(tokenAtom);
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);

  const isManager = user?.role === 'manager';

  // Notification dropdown state (dynamic data to be integrated)
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpenNotifications = (event) => setAnchorEl(event.currentTarget);
  const handleCloseNotifications = () => setAnchorEl(null);

  const managerTabs = [
    { label: 'Overview', icon: <DashboardIcon /> },
    { label: 'Staff', icon: <PeopleIcon /> },
    { label: 'Menu', icon: <MenuIcon /> },
    { label: 'Ingredient', icon: <InventoryIcon /> },
    { label: 'Sales', icon: <SalesIcon /> },
    { label: 'Shifts', icon: <ShiftsIcon /> },
    { label: 'Settings', icon: <SettingsIcon /> },
  ];

  const staffTabs = [
    { label: 'Overview', icon: <DashboardIcon /> },
    { label: 'Menu', icon: <MenuIcon /> },
    { label: 'Attendance', icon: <AttendanceIcon /> },
  ];

  const visibleTabs = isManager ? managerTabs : staffTabs;

  const handleTabChange = (e, newValue) => setTabIndex(newValue);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  useEffect(() => {
    if (!token || !user) router.push('/login');
  }, [token, user]);

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar className="container d-flex justify-content-between">
          <Box className="d-flex align-items-center gap-4">
            <Image src={logo} alt="ChowHub" width={100} height={100} />
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              {visibleTabs.map((tab, index) => (
                <Tab
                  key={index}
                  icon={tab.icon}
                  iconPosition="start"
                  label={tab.label}
                  sx={{ fontWeight: 600 }}
                />
              ))}
            </Tabs>
          </Box>

          <Box className="d-flex align-items-center gap-3">
            {isManager && (
              <>
                <IconButton onClick={handleOpenNotifications}>
                  <Badge color="error" variant="dot">
                    <NotificationsIcon color="action" />
                  </Badge>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseNotifications}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem disabled>
                    Notifications will appear here (e.g., low inventory alerts)
                  </MenuItem>
                </Menu>
              </>
            )}


            <Typography variant="body1" color="textSecondary">
              👤 {user?.username}
            </Typography>
            <Button variant="outlined" size="small" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Welcome banner */}
      <Box
        sx={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/create-res-header.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '30vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h4"
          className="text-center text-white"
          sx={{ fontWeight: 'bold', textShadow: '1px 1px 4px #000' }}
        >
          Welcome to {user?.restaurantName}
        </Typography>
      </Box>

      <Container className="mt-4">
        {tabIndex === 0 && children}

        {tabIndex > 0 && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
              {visibleTabs[tabIndex]?.label}
            </Typography>
            <Typography color="text.secondary">
              This section will be implemented in a separate task.
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
}
