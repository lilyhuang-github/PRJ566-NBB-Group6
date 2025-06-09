// import { useAtomValue, useSetAtom } from 'jotai';
// import { tokenAtom, userAtom } from '@/store/atoms';
// import { useRouter } from 'next/router';
// import {
//   Drawer,
//   Box,
//   Typography,
//   Button,
//   IconButton,
//   Toolbar,
//   AppBar,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Badge,
//   Menu,
//   MenuItem,
//   InputBase,
//   Paper
// } from '@mui/material';
// import {
//   Dashboard as DashboardIcon,
//   People as PeopleIcon,
//   MenuBook as MenuIcon,
//   Inventory as InventoryIcon,
//   BarChart as SalesIcon,
//   AccessTime as ShiftsIcon,
//   Settings as SettingsIcon,
//   Notifications as NotificationsIcon,
//   AccessAlarm as AttendanceIcon
// } from '@mui/icons-material';
// import Image from 'next/image';
// import logo from '/public/images/logo.png';
// import { useEffect, useMemo, useState } from 'react';

// export default function DashboardLayout({ children }) {
//   const user = useAtomValue(userAtom);
//   const token = useAtomValue(tokenAtom);
//   const setUser = useSetAtom(userAtom);
//   const setToken = useSetAtom(tokenAtom);
//   const router = useRouter();
//   const username = router.query.restaurantUsername;

//   const isManager = user?.role === 'manager';

//   const [anchorEl, setAnchorEl] = useState(null);
//   const handleOpenNotifications = (event) => setAnchorEl(event.currentTarget);
//   const handleCloseNotifications = () => setAnchorEl(null);

//   const managerTabs = [
//     { label: 'Overview', icon: <DashboardIcon />, path: '' },
//     { label: 'Staff', icon: <PeopleIcon />, path: 'staff' },
//     { label: 'Menu', icon: <MenuIcon />, path: 'menu' },
//     { label: 'Ingredient', icon: <InventoryIcon />, path: 'ingredient' },
//     { label: 'Sales', icon: <SalesIcon />, path: 'sales' },
//     { label: 'Shifts', icon: <ShiftsIcon />, path: 'shifts' },
//     { label: 'Settings', icon: <SettingsIcon />, path: 'settings' }
//   ];

//   const staffTabs = [
//     { label: 'Overview', icon: <DashboardIcon />, path: '' },
//     { label: 'Menu', icon: <MenuIcon />, path: 'menu' },
//     { label: 'Attendance', icon: <AttendanceIcon />, path: 'attendance' }
//   ];

//   const visibleTabs = useMemo(() => (isManager ? managerTabs : staffTabs), [isManager]);
//   const currentPath = router.asPath.split('/').pop();

//   const handleLogout = () => {
//     setUser(null);
//     setToken(null);
//     router.push('/login');
//   };

//   const handleTabClick = (tabPath) => {
//     router.push(`/${username}/dashboard${tabPath ? '/' + tabPath : ''}`);
//   };

//   useEffect(() => {
//     if (!token || !user) {
//       router.push('/login');
//     }
//   }, [token, user]);

//   return (
//     <Box sx={{ display: 'flex', height: '100vh' }}>
//       {/* Sidebar */}
//       <Drawer variant="permanent" anchor="left" sx={{ width: 240 }}>
//         <Box sx={{ width: 240 }}>
//           <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
//             <Image src={logo} alt="ChowHub" width={120} height={100} />
//           </Box>
//           <List>
//             {visibleTabs.map((tab) => (
//               <ListItem
//                 key={tab.label}
//                 onClick={() => handleTabClick(tab.path)}
//                 selected={currentPath === tab.path}
//                 sx={{ cursor: 'pointer' }}
//               >
//                 <ListItemIcon>{tab.icon}</ListItemIcon>
//                 <ListItemText primary={tab.label} />
//               </ListItem>
//             ))}
//           </List>
//         </Box>
//       </Drawer>

//       {/* Main Content */}
//       <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
//         <AppBar position="static" color="default" elevation={1}>
//           <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
//             {/* Restaurant name + search */}
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//               <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
//                 {user?.restaurantUsername || 'My Restaurant'}
//               </Typography>
//               <Paper
//                 component="form"
//                 sx={{
//                   p: '4px 8px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   width: 280,
//                   borderRadius: '12px',
//                   backgroundColor: '#f5f5f5'
//                 }}
//               >
//                 <InputBase
//                   sx={{ ml: 1, flex: 1 }}
//                   placeholder="Search..."
//                   inputProps={{ 'aria-label': 'search dashboard' }}
//                 />
//               </Paper>
//             </Box>

//             {/* User / notifications / logout */}
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//               {isManager && (
//                 <>
//                   <IconButton onClick={handleOpenNotifications}>
//                     <Badge color="error" variant="dot">
//                       <NotificationsIcon color="action" />
//                     </Badge>
//                   </IconButton>
//                   <Menu
//                     anchorEl={anchorEl}
//                     open={Boolean(anchorEl)}
//                     onClose={handleCloseNotifications}
//                   >
//                     <MenuItem disabled>🔔 No new notifications</MenuItem>
//                   </Menu>
//                 </>
//               )}

//               <Typography variant="body1" color="textSecondary">
//                 👤 {user?.firstName|| user?.username ||  user?.email}
//               </Typography>
//               <Button variant="outlined" size="small" color="error" onClick={handleLogout}>
//                 Logout
//               </Button>
//             </Box>
//           </Toolbar>
//         </AppBar>

//         <Box sx={{ p: 3 }}>{children}</Box>
//       </Box>
//     </Box>
//   );
// }

// src/components/DashboardLayout.js
import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAtomValue, useSetAtom } from "jotai";
import { tokenAtom, userAtom } from "@/store/atoms";
import Protected from "./Protected";

import {
  FiHome,
  FiShoppingCart,
  FiBook,
  FiBox,
  FiUsers,
  FiBarChart2,
  FiUserCheck,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";

const NAV_ITEMS = [
  { label: "Overview", icon: <FiHome />, path: "" },
  { label: "Ordering", icon: <FiShoppingCart />, path: "ordering" },
  { label: "Menu", icon: <FiBook />, path: "menu-management", managerOnly: true },
  { label: "Ingredients", icon: <FiBox />, path: "ingredient-management", managerOnly: true },
  { label: "Suppliers", icon: <FiUsers />, path: "supplier-management", managerOnly: true },
  { label: "Sales & Analytics", icon: <FiBarChart2 />, path: "sales-analytics", managerOnly: true },
  { label: "Users", icon: <FiUserCheck />, path: "user-management", managerOnly: true },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { restaurantUsername } = router.query;

  // collapse state
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 60 : 240;

  // figure out which tab is active
  const currentPath = useMemo(() => {
    const parts = router.asPath.split("/");
    return parts[parts.length - 1] || "";
  }, [router.asPath]);

  // role-based filtering
  const user = useAtomValue(userAtom);
  const isManager = user?.role === "manager";
  const tabs = NAV_ITEMS.filter((tab) => !tab.managerOnly || isManager);

  const setToken = useSetAtom(tokenAtom);
  const setUser = useSetAtom(userAtom);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    router.replace("/login");
  }

  return (
    <Protected>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Sidebar */}
        <div
          style={{
            width: sidebarWidth,
            backgroundColor: "#1E1E2F",
            color: "#FFF",
            transition: "width 0.2s",
            overflow: "hidden",
          }}
        >
          {/* collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              margin: "1rem",
              background: "none",
              border: "none",
              color: "#FFF",
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
          >
            {collapsed ? <FiMenu /> : <FiX />}
          </button>

          <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
            {tabs.map(({ label, icon, path }) => {
              const selected = currentPath === path;
              return (
                <li key={path} style={{ margin: "0.5rem 0" }}>
                  <Link
                    href={`/${restaurantUsername}/dashboard${path ? "/" + path : ""}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      color: selected ? "#FFF" : "rgba(255,255,255,0.6)",
                      padding: "0.75rem 1rem",
                      fontWeight: selected ? 600 : 500,
                      fontSize: "0.95rem",
                    }}
                  >
                    <span style={{ marginRight: collapsed ? 0 : 12, fontSize: "1.2rem" }}>
                      {icon}
                    </span>
                    {!collapsed && <span>{label}</span>}
                  </Link>
                </li>
              );
            })}
            <li style={{ margin: "0.5rem 0" }}>
              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.6)",
                  padding: "0.75rem 1rem",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                }}
              >
                <span style={{ marginRight: collapsed ? 0 : 12, fontSize: "1.2rem" }}>
                  <FiLogOut />
                </span>
                {!collapsed && <span>Logout</span>}
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div
          style={{
            flexGrow: 1,
            backgroundColor: "#121212",
            color: "#FFF",
            padding: "1.5rem",
            overflowY: "auto",
          }}
        >
          {children}
        </div>
      </div>
    </Protected>
  );
}
