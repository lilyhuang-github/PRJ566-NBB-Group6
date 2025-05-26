import Protected from '@/components/Protected';
import DashboardLayout from '@/components/DashboardLayout';
import { useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '@/store/atoms';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  ButtonGroup,
  Button,
  useTheme,
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { BarChart, LineChart } from '@mui/x-charts';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function OverviewPage() {
  const user = useAtomValue(userAtom);
  const token = useAtomValue(tokenAtom);
  const theme = useTheme();

  const [overviewStats, setOverviewStats] = useState(null);
  const [shiftSchedule, setShiftSchedule] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !token) return;
      try {
        const res = await apiFetch(`/dashboard/overview/${user.restaurantId}`);
        setOverviewStats(res);
        setShiftSchedule(res.shiftSchedule || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, [user, token]);

  if (!user || !token || !overviewStats) return null;

  const isManager = user.role === 'manager';

  return (
    <Protected>
      <DashboardLayout>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {isManager && (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ backgroundColor: '#e3f2fd', height: 160 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">TOTAL REVENUE</Typography>
                      <Typography variant="h4" fontWeight="bold">${overviewStats.totalRevenue}</Typography>
                      <Typography color="text.secondary" variant="body2" mt={1}>Last 7 days</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ backgroundColor: '#fce4ec', height: 160 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">ORDERS</Typography>
                      <Typography variant="h4" fontWeight="bold">{overviewStats.totalOrders}</Typography>
                      <Typography color="text.secondary" variant="body2" mt={1}>Processed this week</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ backgroundColor: '#ede7f6', height: 160 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">ACTIVE EMPLOYEES</Typography>
                      <Typography variant="h4" fontWeight="bold">{overviewStats.activeEmployees}</Typography>
                      <Typography color="text.secondary" variant="body2" mt={1}>Across all shifts</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ backgroundColor: '#fff8e1', height: 160 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">INVENTORY ALERTS</Typography>
                      <Typography variant="h4" fontWeight="bold">{overviewStats.inventoryAlerts}</Typography>
                      <Typography color="text.secondary" variant="body2" mt={1}>Below threshold</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ backgroundColor: '#e0f7fa', height: 160 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">UPCOMING SHIFTS</Typography>
                      <Typography variant="h4" fontWeight="bold">{overviewStats.upcomingShifts}</Typography>
                      <Typography color="text.secondary" variant="body2" mt={1}>Scheduled today</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ boxShadow: 3 }}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="h6">📈 Overview</Typography>
                          <ButtonGroup variant="outlined" size="small">
                            <Button>Month</Button>
                            <Button>Week</Button>
                          </ButtonGroup>
                        </Box>
                        <LineChart
                          height={260}
                          series={[{ data: overviewStats.revenueChart.values, label: 'Revenue ($)' }]}
                          xAxis={[{ scaleType: 'point', data: overviewStats.revenueChart.labels }]}
                          colors={[theme.palette.primary.main]}
                        />
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card sx={{ boxShadow: 3 }}>
                      <CardContent>
                        <Typography variant="h6" mb={2}>📊 Total Orders</Typography>
                        <BarChart
                          height={260}
                          xAxis={[{ scaleType: 'band', data: overviewStats.orderChart.labels }]}
                          series={[{ data: overviewStats.orderChart.values, label: 'Orders' }]}
                          colors={['#ef5350']}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            )}

            {!isManager && (
              <Grid item xs={12} sm={6} md={6}>
                <Card sx={{ backgroundColor: '#fff3e0', height: 160 }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">MY SHIFT TODAY</Typography>
                    <Typography variant="h4" fontWeight="bold">{overviewStats.myShift?.time || '--'}</Typography>
                    <Typography color="text.secondary" variant="body2" mt={1}>{overviewStats.myShift?.role || '--'}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {!isManager && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" mb={2}>🗓️ My Schedule</Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Day</TableCell>
                          <TableCell>Shift</TableCell>
                          <TableCell>Role</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {shiftSchedule.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{row.day}</TableCell>
                            <TableCell>{row.time}</TableCell>
                            <TableCell>{row.role}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Container>
      </DashboardLayout>
    </Protected>
  );
}