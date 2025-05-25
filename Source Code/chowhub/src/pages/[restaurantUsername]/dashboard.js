import Protected from '@/components/Protected';
import { useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '@/store/atoms';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  useTheme,
} from '@mui/material';
import { BarChart } from '@mui/x-charts';
import DashboardLayout from '@/components/DashboardLayout';

export default function DashboardPage() {
  const user = useAtomValue(userAtom);
  const token = useAtomValue(tokenAtom);
  const theme = useTheme();

  if (!user || !token) return null;

  // TODO: Replace with real chart data from backend
  const chartData = {
    labels: [], // e.g: ['Mon', 'Tue', ...]
    values: [], // e.g: [500, 600, ...]
  };

  return (
    <Protected>
      <DashboardLayout>
        <Grid container spacing={3}>
          {/*  Restaurant Info */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                backgroundColor: '#f1f8e9',
                boxShadow: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardContent>
                <Typography variant="h6">📍 Restaurant Info</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography>Name: {user.restaurantName}</Typography>
                <Typography>Location: {user.restaurantLocation}</Typography>
                <Typography>Role: {user.role}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/*Staff Overview */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                backgroundColor: '#fff3e0',
                boxShadow: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardContent>
                <Typography variant="h6">👥 Staff Overview</Typography>
                <Divider sx={{ my: 1 }} />
                {/* TODO: Replace with real staff summary data */}
                <Typography>Active Employees: --</Typography>
                <Typography>Next Shift: --</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/*  Ingredient Snapshot */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                backgroundColor: '#ede7f6',
                boxShadow: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardContent>
                <Typography variant="h6">🧂 Ingredient Snapshot</Typography>
                <Divider sx={{ my: 1 }} />
                {/* TODO: Replace with live ingredient snapshot */}
                <Typography>Burgers: --</Typography>
                <Typography>Fries: --</Typography>
                <Typography>Sodas: --</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/*  Weekly Sales Chart */}
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: '#e3f2fd', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">📊 Weekly Sales Summary</Typography>
                <Divider sx={{ my: 1 }} />
                {/* TODO: Fetch and render real sales data */}
                <Typography>Total Revenue: --</Typography>
                <Typography>Orders: --</Typography>
                <Typography>Top Item: --</Typography>
                <Box sx={{ mt: 3 }}>
                  <BarChart
                    xAxis={[{ scaleType: 'band', data: chartData.labels }]}
                    series={[{ data: chartData.values, label: 'Sales ($)' }]}
                    height={220}
                    colors={[theme.palette.primary.main]}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DashboardLayout>
    </Protected>
  );
}
