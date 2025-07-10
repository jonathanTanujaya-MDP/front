
import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Box, Grid, Paper, useTheme, CircularProgress, Divider } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { getTransactions } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Transaction {
  id: number;
  category_name: string;
  amount: number | string;
  type: 'income' | 'expense';
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getTransactions();
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const { totalIncome, totalExpense, netBalance } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + parseFloat(String(t.amount) || '0'), 0);
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + parseFloat(String(t.amount) || '0'), 0);

    return {
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense,
    };
  }, [transactions]);

  const expenseByCategory = useMemo(() => {
    const data: { [key: string]: number } = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const amount = parseFloat(String(t.amount));
        if (!isNaN(amount)) {
          if (data[t.category_name]) {
            data[t.category_name] += amount;
          } else {
            data[t.category_name] = amount;
          }
        }
      });
    return data;
  }, [transactions]);

  const incomeByCategory = useMemo(() => {
    const data: { [key: string]: number } = {};
    transactions
      .filter(t => t.type === 'income')
      .forEach(t => {
        const amount = parseFloat(String(t.amount));
        if (!isNaN(amount)) {
          if (data[t.category_name]) {
            data[t.category_name] += amount;
          } else {
            data[t.category_name] = amount;
          }
        }
      });
    return data;
  }, [transactions]);

  const expenseChartData = {
    labels: Object.keys(expenseByCategory),
    datasets: [
      {
        label: 'Expense',
        data: Object.values(expenseByCategory),
        backgroundColor: theme.palette.error.main, // Use theme's error color
        borderColor: theme.palette.error.main,
        borderWidth: 1,
      },
    ],
  };

  const incomeChartData = {
    labels: Object.keys(incomeByCategory),
    datasets: [
      {
        label: 'Income',
        data: Object.values(incomeByCategory),
        backgroundColor: theme.palette.success.main, // Use theme's success color
        borderColor: theme.palette.success.main,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme.palette.text.primary,
        },
      },
      tooltip: {
        backgroundColor: theme.palette.mode === 'dark' ? '#2C3E50' : '#fff',
        titleColor: theme.palette.mode === 'dark' ? '#ECEFF1' : '#212121',
        bodyColor: theme.palette.mode === 'dark' ? '#ECEFF1' : '#212121',
        borderColor: theme.palette.divider,
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme.palette.text.secondary,
        },
        grid: {
          color: theme.palette.divider,
        },
      },
      y: {
        ticks: {
          color: theme.palette.text.secondary,
        },
        grid: {
          color: theme.palette.divider,
        },
      },
    },
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Income</Typography>
            <Typography variant="h4" sx={{ color: theme.palette.success.main }}>${totalIncome.toFixed(2)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Expense</Typography>
            <Typography variant="h4" sx={{ color: theme.palette.error.main }}>${totalExpense.toFixed(2)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Net Balance</Typography>
            <Typography variant="h4" sx={{ color: netBalance >= 0 ? theme.palette.success.main : theme.palette.error.main }}>${netBalance.toFixed(2)}</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'stretch' }}>
            <Paper sx={{ p: 2, flexGrow: 1, minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" align="center" gutterBottom>Expense by Category</Typography>
              {Object.keys(expenseByCategory).length > 0 ? (
                  <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bar data={expenseChartData} options={chartOptions} />
                  </Box>
              ) : (
                  <Typography align="center" sx={{ mt: 4 }}>No expense data to display.</Typography>
              )}
            </Paper>
            
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
            <Divider orientation="horizontal" flexItem sx={{ display: { xs: 'block', md: 'none' } }} />

            <Paper sx={{ p: 2, flexGrow: 1, minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" align="center" gutterBottom>Income by Category</Typography>
              {Object.keys(incomeByCategory).length > 0 ? (
                  <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bar data={incomeChartData} options={chartOptions} />
                  </Box>
              ) : (
                  <Typography align="center" sx={{ mt: 4 }}>No income data to display.</Typography>
              )}
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
