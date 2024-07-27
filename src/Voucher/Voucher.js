import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Paper,
  Grid,
  Typography,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  IconButton,
  TableCell,
} from "@mui/material";
import { toWords } from "number-to-words";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import image from '../../src/Navbar/KRT Gold Finance Logo PNG File.png';
import './Voucher.css';

const Voucher = () => {
  const [formData, setFormData] = useState({
    customerId: "",
    loanNo: "",
    jwNo: "",
    date: "",
    customerName: "",
    schema: "",
    rupeesInWords: "",
    principal: "",
    interest: "",
    noOfDays: "",
    loanAmount: "",
    cashier: "",
    customer: "",
    percent: "",
    laonsamount: '',
  });
  const [file, setFile] = useState(null);
  const [customerFile, setCustomerFile] = useState(null);
  const [calculatedInterest, setCalculatedInterest] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "date") {
      const formattedDate = value; // Already in the correct format
      setFormData({ ...formData, [name]: formattedDate });
    } else if (name === "loanAmount") {
      const amountInWords = toWords(value);
      setFormData({ ...formData, [name]: value, rupeesInWords: amountInWords });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === "customerId") {
      fetchLedgerData(value);
    }

    if (["principal", "percent", "noOfDays"].includes(name)) {
      calculateLoanAmount({ ...formData, [name]: value });
    }
  };

  const fetchLedgerData = (customerId) => {
    axios.get(`http://localhost:5000/api/ledger/${customerId}`)
      .then((response) => {
        const ledgerData = response.data;
        const formattedDate = new Date(ledgerData.date).toISOString().split('T')[0]; // Format the date correctly
        const amountInWords = toWords(ledgerData.loanAmount);
        setFormData({
          customerId: ledgerData.customerId,
          loanNo: ledgerData.loanNumber,
          jwNo: ledgerData.jlNumber,
          date: formattedDate,
          customerName: ledgerData.customerName,
          schema: ledgerData.schema,
          rupeesInWords: amountInWords,
          principal: ledgerData.principal,
          interest: ledgerData.interest,
          noOfDays: ledgerData.noOfDays,
          principal: ledgerData.loanAmount,
          cashier: ledgerData.cashier,
          customer: ledgerData.customer,
          percent: ledgerData.percent,
          laonsamount: ledgerData.laonsamount
        });
      })
      .catch((error) => {
        console.error("Error fetching ledger data:", error);
      });
  };

  const calculateLoanAmount = ({ principal, percent, noOfDays }) => {
    if (principal && percent && noOfDays) {
      const calculatedInterest = (principal * percent * noOfDays) / 1200; 
      const totalAmount = parseFloat(principal) + calculatedInterest;
      const amountInWords = toWords(totalAmount);
      setFormData({
        ...formData,
        noOfDays,
        loanAmount: totalAmount.toFixed(2),
        rupeesInWords: amountInWords,
        laonsamount: totalAmount.toFixed(2)
      });
      setCalculatedInterest(calculatedInterest.toFixed(2));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleCustomerFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setCustomerFile(selectedFile);
  };

  const handleCustomerFileRemove = () => {
    setCustomerFile(null);
  };

  const handleFileRemove = () => {
    setFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
    // Reset form after submission (if needed)
    setFormData({
      customerId: "",
      loanNo: "",
      jwNo: "",
      date: "",
      customerName: "",
      schema: "",
      rupeesInWords: "",
      principal: "",
      interest: "",
      noOfDays: "",
      loanAmount: "",
      cashier: "",
      customer: "",
      percent: "",
      laonsamount: "",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: "20px", marginTop: "70px" }}>
      <Paper
        elevation={2}
        style={{ padding: "20px" }}
        sx={{ maxWidth: 600, margin: "auto" }}
        className="paperbg2"
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <img
              src={image}
              alt="Logo"
              style={{ width: "100%", height: "auto" }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h5" align="center" gutterBottom>
              KRT GOLD FINANCE
            </Typography>
            <Typography variant="subtitle1" align="center">
              Cell No: 9042425142, 9042425642
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              135/5 Velavan Complex, Near (MGN) Lodge, Salem Main Road,
              <br />
              Komarapalayam-638183
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" align="center">
              RECEIPT VOUCHER
            </Typography>
          </Grid>
        </Grid>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Customer Id"
                name="customerId"
                value={formData.customerId}
                onChange={handleInputChange}
                variant="standard"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Loan Number"
                name="loanNo"
                value={formData.loanNo}
                onChange={handleInputChange}
                variant="standard"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Jewel Number"
                name="jwNo"
                value={formData.jwNo}
                onChange={handleInputChange}
                variant="standard"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                variant="standard"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Customer Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                variant="standard"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Schema"
                name="schema"
                value={formData.schema}
                onChange={handleInputChange}
                variant="standard"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Rupees in Words"
                name="rupeesInWords"
                value={formData.rupeesInWords}
                onChange={handleInputChange}
                variant="standard"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
             <TableContainer
                component={Paper}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "10px auto",
                  maxWidth: "80%",
                }}
                sx={{ mt: 2, mb: 5 }}
                className="tables"
              >
                <Table
                  aria-label="Customer Entry Details - Part 2"
                  className="table-bordered"
                >
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <TextField
                          label="Principal"
                          name="principal"
                          value={formData.principal}
                          onChange={handleInputChange}
                          variant="standard"
                          fullWidth
                          required
                          InputProps={{ disableUnderline: true }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                  

                      <TableCell className="disables">
                        <TextField
                          label="Interest Rate"
                          name="percent"
                          value={formData.percent}
                          onChange={handleInputChange}
                          variant="standard"
                          fullWidth
                          required
                          InputProps={{ disableUnderline: true }}
                        />
                      </TableCell>
                      </TableRow>
                      <TableRow>
                      <TableCell>
                        <TextField
                          label="Number of Days"
                          name="noOfDays"
                          value={formData.noOfDays}
                          onChange={handleInputChange}
                          variant="standard"
                          fullWidth
                          required
                          InputProps={{ disableUnderline: true }}
                        />
                      </TableCell>
                      </TableRow>
                      <TableRow>
                      <TableCell>
                        <TextField
                          label="Interest Amount"
                          name="interestAmount"
                          value={calculatedInterest}
                          variant="standard"
                          fullWidth
                          InputProps={{
                            readOnly: true, disableUnderline: true 
                          }}
                          
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Amount"
                name="amount"
                value={formData.laonsamount}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              {file ? (
                <div style={{ position: "relative", textAlign: "center" }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Cashier Sign"
                    style={{ width: "90%", height: "60px" }}
                  />
                  <IconButton
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: "rgba(255, 255, 255, 0.7)",
                    }}
                    onClick={handleFileRemove}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              ) : (
                <Button variant="outlined" component="label" fullWidth>
                  Upload Cashier Sign
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              {customerFile ? (
                <div style={{ position: "relative", textAlign: "center" }}>
                  <img
                    src={URL.createObjectURL(customerFile)}
                    alt="Customer Sign"
                    style={{ width: "90%", height: "60px" }}
                  />
                  <IconButton
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: "rgba(255, 255, 255, 0.7)",
                    }}
                    onClick={handleCustomerFileRemove}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              ) : (
                <Button variant="outlined" component="label" fullWidth>
                  Upload Customer Sign
                  <input
                    type="file"
                    hidden
                    onChange={handleCustomerFileChange}
                  />
                </Button>
              )}
            </Grid>
          
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                onClick={handlePrint}
              >
                Print
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default Voucher;
