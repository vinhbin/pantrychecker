'use client'
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { 
  Box, 
  Modal, 
  Typography, 
  Stack, 
  TextField, 
  Button, 
  IconButton, 
  Snackbar, 
  CircularProgress 
} from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from "firebase/firestore";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SearchIcon from '@mui/icons-material/Search';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  const updateInventory = async () => {
    setLoading(true);
    try {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((doc) => {
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        });
      });
      setInventory(inventoryList);
      setFilteredInventory(inventoryList);
    } catch (error) {
      console.error('Error updating inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1 });
      } else {
        await setDoc(docRef, { quantity: 1 });
      }

      setSnackbar({ open: true, message: `${item} added to inventory.`, severity: 'success' });
      await updateInventory();
    } catch (error) {
      setSnackbar({ open: true, message: `Error adding ${item}: ${error.message}`, severity: 'error' });
    }
  };

  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity - 1 });
        }

        setSnackbar({ open: true, message: `${item} removed from inventory.`, severity: 'success' });
      } else {
        setSnackbar({ open: true, message: `${item} not found in inventory.`, severity: 'error' });
      }

      await updateInventory();
    } catch (error) {
      setSnackbar({ open: true, message: `Error removing ${item}: ${error.message}`, severity: 'error' });
    }
  };

  useEffect(() => {
    const fetchInventory = async () => {
      await updateInventory();
    };

    fetchInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const searchResults = inventory.filter(({ name }) =>
      name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredInventory(searchResults);
  };

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center"
      gap={4}
      sx={{ backgroundColor: '#f4f6f8' }}
    >
      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute" 
          top="50%" 
          left="50%"
          width={400}
          bgcolor="white"
          borderRadius="12px"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
            border: 'none'
          }}
        >
          <Typography variant="h6" color={"black"}>Add New Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Item name"
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              sx={{
                backgroundColor: '#1976d2',
                ':hover': {
                  backgroundColor: '#115293',
                }
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button 
        variant="contained" 
        onClick={handleOpen}
        sx={{
          backgroundColor: '#1976d2',
          ':hover': {
            backgroundColor: '#115293',
          }
        }}
      >
        Add New Item
      </Button>

      <Stack 
        direction="row" 
        spacing={2} 
        alignItems="center"
        sx={{ width: '90%', maxWidth: '800px', marginBottom: 2 }}
      >
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search items..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: '#1976d2', marginRight: 1 }} />
            ),
          }}
        />
      </Stack>

      <Box 
        borderRadius="12px"
        boxShadow={4}
        overflow="hidden"
        width="90%"
        maxWidth="800px"
        bgcolor="white"
      >
        <Box 
          width="100%" 
          height="100px" 
          bgcolor="#1976d2" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
        > 
          <Typography variant='h4' color='white'>
            Inventory Items
          </Typography>
        </Box>

        <Stack 
          width="100%" 
          maxHeight="400px" 
          spacing={2} 
          sx={{ overflowY: 'auto', padding: 2 }}
        >
          {loading ? (
            <Box 
              width="100%" 
              display="flex" 
              justifyContent="center" 
              alignItems="center" 
              height="200px"
            >
              <CircularProgress />
            </Box>
          ) : (
            filteredInventory.map(({ name, quantity }) => (
              <Box 
                key={name} 
                width="100%"
                minHeight="80px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#fafafa"
                padding={2}
                borderRadius="8px"
                boxShadow={1}
              >
                <Typography variant="h6" color="#333">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h6" color="#333">
                  Quantity: {quantity}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton 
                    color="primary" 
                    onClick={() => addItem(name)}
                    sx={{ color: '#1976d2' }}
                  >
                    <AddCircleIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => removeItem(name)}
                  >
                    <RemoveCircleIcon />
                  </IconButton>
                </Stack>
              </Box>
            ))
          )}
        </Stack>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ 
          '& .MuiSnackbarContent-root': {
            backgroundColor: snackbar.severity === 'success' ? '#4caf50' : '#f44336',
          }
        }}
      />
    </Box>
  ); 
}
