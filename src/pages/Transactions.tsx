import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, 
  Select, MenuItem, FormControl, InputLabel, IconButton, List, ListItem, ListItemText, 
  ListItemSecondaryAction, useTheme, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, getCategories } from '../services/api';

interface Transaction {
  id: number;
  user_id: number;
  category_id: number;
  category_name: string;
  amount: number | string;
  type: 'income' | 'expense';
  description: string;
  transaction_date: string;
}

interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState<number | string>('');
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await getTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleOpenDialog = (transaction?: Transaction) => {
    setCurrentTransaction(transaction || null);
    setAmount(transaction ? transaction.amount.toString() : '');
    setType(transaction ? transaction.type : 'expense');
    setDescription(transaction ? transaction.description : '');
    setTransactionDate(transaction ? new Date(transaction.transaction_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    setCategoryId(transaction ? transaction.category_id : '');
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTransaction(null);
    setAmount('');
    setType('expense');
    setDescription('');
    setTransactionDate(new Date().toISOString().split('T')[0]);
    setCategoryId('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = true;
    if (!description.trim()) newErrors.description = true;
    if (!categoryId) newErrors.categoryId = true;
    if (!transactionDate) newErrors.transactionDate = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const transactionData = {
        user_id: 1,
        category_id: Number(categoryId),
        amount: parseFloat(amount),
        type,
        description,
        transaction_date: transactionDate,
      };

      if (currentTransaction) {
        await updateTransaction(currentTransaction.id, transactionData);
      } else {
        await createTransaction(transactionData);
      }
      fetchTransactions();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deleteTransaction(id);
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const modalStyle = {
    '& .MuiDialog-paper': {
      backgroundColor: theme.palette.mode === 'dark' ? '#2C3E50' : theme.palette.background.paper,
      borderRadius: '16px',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
      width: '90vw',
      maxWidth: '480px',
      maxHeight: '90vh',
    },
  };

  const inputStyle = theme.palette.mode === 'dark' ? {
    backgroundColor: '#1E2A38',
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: 'transparent' },
        '&:hover fieldset': { borderColor: '#3F51B5' },
        '&.Mui-focused fieldset': { borderColor: '#3F51B5' },
    },
    '& .MuiInputLabel-root': { color: '#90A4AE' },
    '& .MuiInputBase-input': { color: '#FFFFFF' }
  } : {};

  return (
    <Box sx={{ p: 3, borderRadius: '16px', backgroundColor: theme.palette.background.paper }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Transactions
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add New Transaction
        </Button>
      </Box>

      {loading && transactions.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : transactions.length === 0 ? (
        <Typography sx={{ textAlign: 'center', mt: 4 }}>No transactions found. Click "Add New Transaction" to get started.</Typography>
      ) : (
        <List>
          {transactions.map((transaction) => (
            <ListItem key={transaction.id} sx={{ mb: 1, backgroundColor: theme.palette.background.default, borderRadius: '8px' }}>
              <ListItemText
                primary={transaction.description}
                secondary={`Category: ${transaction.category_name} | Date: ${new Date(transaction.transaction_date).toLocaleDateString()}`}
              />
              <ListItemSecondaryAction>
                <Typography variant="body1" sx={{ color: transaction.type === 'income' ? 'green' : 'red', mr: 2 }}>
                  {transaction.type === 'income' ? '+' : '-'} ${parseFloat(String(transaction.amount)).toFixed(2)}
                </Typography>
                <IconButton edge="end" onClick={() => handleOpenDialog(transaction)}><EditIcon /></IconButton>
                <IconButton edge="end" onClick={() => handleDelete(transaction.id)}><DeleteIcon /></IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} sx={modalStyle}>
        <DialogTitle sx={{ color: theme.palette.text.primary, fontWeight: '600' }}>
          {currentTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '16px', pt: '16px !important' }}>
          <TextField autoFocus label="Amount" type="number" fullWidth variant="outlined" value={amount} onChange={(e) => setAmount(e.target.value)} error={!!errors.amount} helperText={errors.amount && "Amount is required"} sx={inputStyle} />
          <FormControl fullWidth variant="outlined" sx={inputStyle} error={!!errors.categoryId}>
            <InputLabel>Category</InputLabel>
            <Select value={categoryId} label="Category" onChange={(e) => setCategoryId(e.target.value as number)} MenuProps={{ sx: { '& .MuiPaper-root': { backgroundColor: theme.palette.mode === 'dark' ? '#2C3E50' : '' } } }}>
              {categories.filter(c => c.type === type).map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
            {errors.categoryId && <Typography color="error" variant="caption">Category is required</Typography>}
          </FormControl>
          <FormControl fullWidth variant="outlined" sx={inputStyle}>
            <InputLabel>Type</InputLabel>
            <Select value={type} label="Type" onChange={(e) => setType(e.target.value as 'income' | 'expense')}>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Description" type="text" fullWidth variant="outlined" value={description} onChange={(e) => setDescription(e.target.value)} error={!!errors.description} helperText={errors.description && "Description is required"} sx={inputStyle} />
          <TextField label="Transaction Date" type="date" fullWidth variant="outlined" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} InputLabelProps={{ shrink: true }} error={!!errors.transactionDate} helperText={errors.transactionDate && "Date is required"} sx={inputStyle} />
        </DialogContent>
        <DialogActions sx={{ p: '24px' }}>
          <Button onClick={handleCloseDialog} sx={{ color: theme.palette.text.secondary, transition: 'all 0.2s', '&:hover': { color: theme.palette.text.primary, backgroundColor: 'transparent' } }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: '#2979FF', color: '#FFFFFF', borderRadius: '8px', transition: 'all 0.2s', '&:hover': { backgroundColor: '#2962FF' } }}>{currentTransaction ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transactions;