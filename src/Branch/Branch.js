import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import axios from "axios";

const Branch = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/entry");
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <Grid container spacing={3} sx={{ mt: 9 }}>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ padding: 3 }} className="paperbg">
          <Typography variant="h5" component="h2">
            Branch A
          </Typography>
          <Typography>Manager: Karthik</Typography>
          <Typography>RootAdmin: Devi</Typography>
          <Typography
            onClick={handleDialogOpen}
            style={{
              cursor: "pointer",
              color: "black",
              textDecoration: "none",
            }}
          >
            Total Gold Loan Entry: {entries.length} {/* Display total count */}
          </Typography>
          <Typography>Total Gold loan Retrieved :</Typography>
          <Typography>Total Transactions:</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ padding: 3 }} className="paperbg">
          <Typography variant="h5" component="h2">
            Branch B
          </Typography>
          <Typography>Manager: Karthik</Typography>
          <Typography>RootAdmin: Devi</Typography>
          <Typography
            onClick={handleDialogOpen}
            style={{
              cursor: "pointer",
              color: "black",
              textDecoration: "none",
            }}
          >
            Total Gold Loan Entry: {entries.length} {/* Display total count */}
          </Typography>
          <Typography>TotalGold loan Retrieved :</Typography>
          <Typography>Total Transactions:</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ padding: 3 }} className="paperbg">
          <Typography variant="h5" component="h2">
            Branch C
          </Typography>
          <Typography>Manager: Karthik</Typography>
          <Typography>RootAdmin: Devi</Typography>
          <Typography
            onClick={handleDialogOpen}
            style={{
              cursor: "pointer",
              color: "black",
              textDecoration: "none",
            }}
          >
            Total Gold Loan Entry: {entries.length} {/* Display total count */}
          </Typography>
          <Typography>TotalGold loan Retrieved :</Typography>
          <Typography>Total Transactions:</Typography>
        </Paper>
      </Grid>

      {/* Dialog Component */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>Total Gold Loan Entries</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table sx={{ border: '1px solid black' }}>
              <TableHead sx={{ border: '1px solid black' }}>
                <TableRow sx={{ border: '1px solid black' }}>
                  <TableCell sx={{ border: '1px solid black' }}>Loan Number</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Customer Name</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Loan Category</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Date</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Metal</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Product Name</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Eligibility Criteria</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Processing Fees</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry._id}>
                    <TableCell sx={{ border: '1px solid black' }}>{entry.loanNumber}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{entry.customerName}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{entry.loanCategory}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{entry.date}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{entry.metal.join(", ")}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{entry.productName}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{entry.eligibilityCriteria.join(", ")}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{entry.processingFees}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Branch;
