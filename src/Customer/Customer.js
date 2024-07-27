import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Paper,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const Customer = () => {
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchId, setSearchId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loanEntries, setLoanEntries] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/ledger/all")
      .then((response) => {
        const formattedData = response.data.map((entry) => ({
          ...entry,
          date: formatDate(entry.date),
        }));
        setLedgerEntries(formattedData);
        setFilteredEntries(formattedData); // Set initial filtered entries
      })
      .catch((error) => {
        console.error("Error fetching ledger entries:", error);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handlePrint = () => {
    window.print();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDateChange = () => {
    const filtered = ledgerEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      // Adjust end date to include the whole day
      end.setHours(23, 59, 59, 999);
      return entryDate >= start && entryDate <= end;
    });
    setFilteredEntries(filtered);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value.toUpperCase(); // Convert to uppercase
    setSearchId(value);
    const filtered = ledgerEntries.filter((entry) =>
      entry.customerId.includes(value)
    );
    setFilteredEntries(filtered);
  };

  const handleDownload = (filename) => {
    axios
      .get(`http://localhost:5000/api/ledger/download/${filename}`, {
        responseType: 'blob', // Ensure the response type is set to blob
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
      });
  };
  const fetchLoanEntries = async (customerId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/loanEntry/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching loan entries:', error);
      return [];
    }
  };
  
  const handleOpenDialog = async (entry) => {
    setSelectedEntry(entry);
    setDialogOpen(true);
    try {
      const response = await fetchLoanEntries(entry.customerId);
      setLoanEntries(response);
    } catch (error) {
      console.error('Error fetching loan entries:', error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEntry(null);
    setLoanEntries([]);
  };

  return (
    <div>
      <Paper elevation={3} style={{ padding: "20px" }} sx={{ mt: 10 }} className="paperbg">
        <Typography variant="h5" align="center" gutterBottom>
          Customer Entry Details
          <Button variant="contained" color="primary" onClick={handlePrint} style={{ marginLeft: "20px" }}>
            Print
          </Button>
        </Typography>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} align="center">
            <Box display="flex" justifyContent="space-between" mb={2}>
              <TextField
                label="From Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                sx={{ mr: 2 }}
              />
              <TextField
                label="To Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                sx={{ mr: 2 }}
              />
              <Button variant="outlined" onClick={handleDateChange} className="filt-button">
                Filter by Date
              </Button>
              <TextField
                label="Search by Customer ID"
                value={searchId}
                onChange={handleSearchChange}
                sx={{ ml: 2 }}
              />
            </Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Ledger Entries
            </Typography>
            <TableContainer component={Paper} sx={{ width: 1200 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ border: "1px solid black" }}>Customer ID</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>Loan Number</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>Date</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>Customer Name</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>Mobile Number</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>Jewel Number</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>Alter Mob.No</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>Landmark</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>Address</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>Jewel Details</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>Quality</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>Quantity</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>Itemweight</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>Grossweight</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>Netweight</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>Schema</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>Percent</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>Loan Amount</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>Download Proof</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>Payment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEntries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entry) => (
                    <TableRow key={entry._id}>
                      <TableCell sx={{ border: "1px solid black" }}>{entry.customerId}</TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>{entry.loanNumber}</TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>{entry.date}</TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>{entry.customerName}</TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>{entry.mobileNumber1}</TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>{entry.jlNumber}</TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>{entry.mobileNumber2}</TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>{entry.landmark}</TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>{entry.address}</TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>{entry.jDetails}</TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>{entry.quality}</TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>{entry.quantity}</TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>{entry.iw}</TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>{entry.gw}</TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>{entry.nw}</TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>{entry.schema}</TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>{entry.percent}</TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>{entry.loanAmount}</TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        <Button variant="outlined" onClick={() => handleDownload(entry.proofFilename)}>
                          Download
                        </Button>
                        
                      </TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        <Button variant="contained" color="primary" onClick={() => handleOpenDialog(entry)}>
                          Payment
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredEntries.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          {selectedEntry && (
            <div>
              <Typography variant="h6">Customer ID: {selectedEntry.customerId}</Typography>
              <Typography variant="body1">Loan Number: {selectedEntry.loanNumber}</Typography>
              <Typography variant="body1">Loan Amount: {selectedEntry.loanAmount}</Typography>
              <div style={{ padding: "20px", marginTop: "20px" }}>
                <Paper elevation={2} style={{ padding: "20px" }} sx={{ maxWidth: 800, margin: "auto" }} className="paperbg">
                  <TableContainer component={Paper}>
                    <Table sx={{ border: "1px solid black" }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ border: "1px solid black" }}>Date</TableCell>
                          <TableCell sx={{ border: "1px solid black" }}>Amount</TableCell>
                          <TableCell sx={{ border: "1px solid black" }}>Interest</TableCell>
                          <TableCell sx={{ border: "1px solid black" }}>Total Amount</TableCell>
                          <TableCell sx={{ border: "1px solid black" }}>Customer ID</TableCell>
                          <TableCell sx={{ border: "1px solid black" }}>No of Days</TableCell>
                          <TableCell sx={{ border: "1px solid black" }}>Interest Principle</TableCell>
                          <TableCell sx={{ border: "1px solid black" }}>Interest Amount</TableCell>
                          <TableCell sx={{ border: "1px solid black" }}>Balance</TableCell>
                          <TableCell sx={{ border: "1px solid black" }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loanEntries.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ border: "1px solid black" }}>{row.paymentDate}</TableCell>
                            <TableCell sx={{ border: "1px solid black" }}>{row.loanAmount}</TableCell>
                            <TableCell sx={{ border: "1px solid black" }}>{row.interest}</TableCell>
                            <TableCell sx={{ border: "1px solid black" }}>{row.totalAmount}</TableCell>
                            <TableCell sx={{ border: "1px solid black" }}>{row.customerId}</TableCell>
                            <TableCell sx={{ border: "1px solid black" }}>{row.noOfDays}</TableCell>
                            <TableCell sx={{ border: "1px solid black" }}>{row.interestPrinciple}</TableCell>
                            <TableCell sx={{ border: "1px solid black" }}>{row.interestamount}</TableCell>
                            <TableCell sx={{ border: "1px solid black" }}>{row.balance}</TableCell>
                            <TableCell sx={{ border: "1px solid black" }}>
                             
                              <Button variant="outlined" color="primary" onClick={() => handlePrint()}>
                                Print
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Customer;
