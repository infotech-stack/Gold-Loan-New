import React, { useState } from "react";
import {
  Button,
  TextField,
  Paper,
  Grid,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PrintDialog from "./printDialog";
import { toWords } from "number-to-words";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Report = () => {
  const navigate = useNavigate();
  const [isClosed, setIsClosed] = useState(false);
  const [formData, setFormData] = useState({
    jewelNo: "",
    customerName: "",
    date: "",
    customerId: "",
    loanNo: "",
    mobileNumber: "",
    address: "",
    loan: "",
    loanAmount: "",
    totalAmount: "",
    items: "",
    quality: "",
    quantity: "",
    totalWeightGms: "",
    gross: "",
    net: "",
    agreementSigned: "",
    customerSign1: "",
    cashReceivedRs: "",
    rupeesInWords: "",
    paymentNo: "",
    paymentDate: "",
    receiptNo: "",
    noOfDays: "",
    interestPrinciple: "",
    balancePrinciple: "",
    remarks: "",
    loanClosureDate: "",
    closedate: "",
    customersign: "",
    schema: "",
    percent: "",
    totalamount: "",
    interest: "",
    interestamount: "",
  });
  const [previousBalances, setPreviousBalances] = useState({});
  const [validationErrors, setValidationErrors] = useState({
    jewelNo: false,
    customerName: false,
    date: false,
    customerId: false,
    loanNo: false,
    mobileNumber: false,
    address: false,
    loan: false,
    loanAmount: false,
    totalAmount: false,
    items: false,
    quality: false,
    quantity: false,
    totalWeightGms: false,
    gross: false,
    net: false,
    agreementSigned: false,
    cashReceivedRs: false,
    rupeesInWords: false,
    paymentNo: false,
    paymentDate: false,
    receiptNo: false,
    closedate: false,
    noOfDays: false,
    interestPrinciple: false,
    balancePrinciple: false,
    remarks: false,
    loanClosureDate: false,
    customersign: false,
    cashiersign: false,
    authorizedFile: false,
    schema: false,
    percent: false,
    totalamount: false,
    interestamount: false,
    interest: false,
  });
  const [balance, setBalance] = useState(0);
  const [formDisabled, setFormDisabled] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
      fetchReportData(value);
    }
  };

  const fetchReportData = (customerId) => {
    axios
      .get(`http://localhost:5000/api/ledger/${customerId}`)
      .then((response) => {
        const reportData = response.data;
        const formattedDate = new Date(reportData.date)
          .toISOString()
          .split("T")[0];
        const amountInWords = toWords(reportData.loanAmount);
        setFormData({
          jewelNo: reportData.jlNumber,
          customerName: reportData.customerName,
          date: formattedDate,
          customerId: reportData.customerId,
          loanNo: reportData.loanNumber,
          mobileNumber: reportData.mobileNumber1,
          address: reportData.address,
          loanAmount: reportData.loanAmount,
          rupeesInWords: amountInWords,
          totalAmount: reportData.totalAmount,
          items: reportData.iw,
          quality: reportData.quality,
          quantity: reportData.quantity,
          totalWeightGms: reportData.totalWeightGms,
          schema: reportData.schema,
          percent: reportData.percent,
        });
      })
      .catch((error) => {
        console.error("Error fetching report data:", error);
      });
  };

  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    calculateInterest();
  }, [formData.percent, formData.loanAmount]);

  const calculateInterest = () => {
    const { percent, loanAmount } = formData;
    let interest = 0;

    if (percent && loanAmount) {
      const principal = parseFloat(loanAmount);

      // Ensure percentage is correctly formatted
      const percentage = parseFloat(percent.replace("%", ""));

      if (!isNaN(principal) && !isNaN(percentage)) {
        if (percentage === 12) {
          interest = principal * 0.12; // One year
        } else if (percentage === 18) {
          interest = (principal * 0.18) / 2; // Six months
        } else if (percentage === 24) {
          interest = (principal * 0.24) / 4; // Three months
        } else {
          interest = 0; // Default to 0 if percentage doesn't match
        }

        setFormData((prevData) => ({
          ...prevData,
          interest: interest.toFixed(2),
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          interest: "",
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        interest: "",
      }));
    }
  };
  const [authorizedFile, setAuthorizedFile] = useState(null);
  const [customersign, setCustomersign] = useState(null);
  const [cashiersign, setCashiersign] = useState(null);
  const [customerId, setCustomerId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handlePrint = (row) => {
    setSelectedRow({
      paymentDate: row.paymentDate,
      customerId: row.customerId,
      customerName: formData.customerName, // Ensure this field exists
      loanNo: formData.loanNo, // Ensure this field exists
      jewelNo: formData.jewelNo, // Ensure this field exists
      schema: formData.schema, // Ensure this field exists
      noOfDays: row.noOfDays,
      interestamount: row.interestamount,
      interestPrinciple: row.interestPrinciple,
      balance: row.balance
    });
    setOpenDialog(true);
  };
  

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFileChange = (setter) => (e) => {
    const selectedFile = e.target.files[0];
    setter(selectedFile);
  };

  const handleFileRemove = (setter) => () => {
    setter(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check for validation errors
    let valid = true;
    let updatedErrors = { ...validationErrors };

    // Reset validation errors
    Object.keys(updatedErrors).forEach((field) => {
      updatedErrors[field] = !formData[field];
    });

    if (!customersign) {
      updatedErrors.customersign = true;
      valid = false;
    } else {
      updatedErrors.customersign = false;
    }
    if (!cashiersign) {
      updatedErrors.cashiersign = true;
      valid = false;
    } else {
      updatedErrors.cashiersign = false;
    }
    if (!authorizedFile) {
      updatedErrors.authorizedFile = true;
      valid = false;
    } else {
      updatedErrors.authorizedFile = false;
    }

    setValidationErrors(updatedErrors);

    if (!valid) {
      Swal.fire({
        title: "Validation Error!",
        text: "Please fill in all required fields.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      // Prepare FormData object
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      if (customersign) formDataToSend.append("customersign", customersign);
      if (cashiersign) formDataToSend.append("cashiersign", cashiersign);
      if (authorizedFile)
        formDataToSend.append("authorizedFile", authorizedFile);

      await axios.post("http://localhost:5000/api/report", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Show success alert
      Swal.fire({
        title: "Success!",
        text: "Form submitted successfully",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Clear form
      setFormData({
        jewelNo: "",
        customerName: "",
        loanDate: "",
        customerId: "",
        loanNo: "",
        mobileNumber: "",
        address: "",
        loan: "",
        loanAmount: "",
        totalAmount: "",
        items: "",
        quality: "",
        quantity: "",
        totalWeightGms: "",
        gross: "",
        net: "",
        cashReceivedRs: "",
        rupeesInWords: "",
        paymentNo: "",
        paymentDate: "",
        receiptNo: "",
        noOfDays: "",
        agreementSigned: "",
        interestPrinciple: "",
        balancePrinciple: "",
        remarks: "",
        loanClosureDate: "",
        schema: "",
        percent: "",
        totalamount: "",
        interestamount: "",
      });
      setCustomersign(null);
      setCashiersign(null);
      setAuthorizedFile(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        title: "Error!",
        text: "There was a problem submitting the form",
        icon: "error",
        confirmButtonText: "OK",
      });
    }

    try {
      // Calculate new balance based on the previous balance
      const previousBalance = previousBalances[formData.customerId] || 0;
      const totalAmount =
        parseFloat(formData.loanAmount) + parseFloat(formData.interest);
      let newBalance;

      if (previousBalance === 0) {
        newBalance =
          totalAmount -
          (parseFloat(formData.interestamount) +
            parseFloat(formData.interestPrinciple));
      } else {
        newBalance =
          previousBalance -
          (parseFloat(formData.interestamount) +
            parseFloat(formData.interestPrinciple));
      }

      const updatedTableData = [
        ...tableData,
        {
          ...formData,
          balance: newBalance,
        },
      ];
      setTableData(updatedTableData);
      console.log("Previous balance:", previousBalance);
      console.log("New balance:", newBalance);

      // Save the new entry
      await axios.post("http://localhost:5000/api/loanEntry", {
        ...formData,
        balance: newBalance,
      });

      await axios.put(
        `http://localhost:5000/api/loanEntry/updateBalance/${formData.customerId}`,
        {
          balance: newBalance,
        }
      );
      // Fetch updated balances to reflect changes in the UI

      const fetchBalances = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/loanEntry/balances"
          );
          const balances = response.data.reduce((acc, entry) => {
            acc[entry.customerId] = entry.balance;
            return acc;
          }, {});
          setPreviousBalances(balances);
        } catch (error) {
          console.error("Failed to fetch balances", error);
        }
      };

      fetchBalances();
      // Notify user of success
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data saved successfully",
      });
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/loanEntry/balances"
        );
        const balances = response.data.reduce((acc, entry) => {
          acc[entry.customerId] = entry.balance;
          return acc;
        }, {});
        setPreviousBalances(balances);
        const customerId = `http://localhost:5000/api/ledger/${customerId}`;
        const customerBalance = balances[customerId];
        if (customerBalance) {
          setIsClosed(customerBalance.isClosed);
        } else {
          setIsClosed(false);
        }
      } catch (error) {
        console.error("Failed to fetch balances", error);
      }
    };

    fetchBalances();
  }, []);
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/balance/${customerId}`
        );
        setBalance(response.data.balance);
        setIsClosed(response.data.isClosed);
        setFormDisabled(response.data.isClosed);
        // Fetch table data if needed
        // const tableDataResponse = await axios.get(`http://localhost:5000/api/loanEntries/${customerId}`);
        // setTableData(tableDataResponse.data);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, [customerId]);

  const handleSave = async (row) => {
    try {
      // Save data without recalculating the balance
      await axios.post("http://localhost:5000/api/loanEntry/add", row);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data saved successfully",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save data",
      });
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchTableData(customerId);
    }
  }, [customerId]);
  const fetchTableData = async (customerId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/loanEntry/${customerId}`
      );
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  useEffect(() => {
    if (formData.customerId) {
      fetchTableData(formData.customerId);
    }
  }, [formData.customerId]);

  return (
    <>
      {isClosed && <Alert variant="warning">Your account is closed.</Alert>}
      <div style={{ padding: "20px", marginTop: "70px" }}>
        <Paper
          elevation={2}
          style={{ padding: "20px" }}
          sx={{ maxWidth: 800, margin: "auto" }}
          className="paperbg"
        >
          <Typography variant="h5" align="center" gutterBottom>
            APPRAISAL ENTRY
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Customer ID"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.customerId}
                  helperText={
                    validationErrors.customerId ? "Customer Id is required" : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Name of the Borrower"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.customerName}
                  helperText={
                    validationErrors.customerName
                      ? "Customer Name is required"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Date of Loan"
                  name="loanDate"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.date}
                  helperText={validationErrors.date ? "Date is required" : ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Loan No"
                  name="loanNo"
                  value={formData.loanNo}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.loanNo}
                  helperText={
                    validationErrors.loanNo ? "Loan number is required" : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Jewel No"
                  name="jewelNo"
                  value={formData.jewelNo}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.jewelNo}
                  helperText={
                    validationErrors.jewelNo ? "Jewel Number is required" : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Mobile Number"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.mobileNumber}
                  helperText={
                    validationErrors.mobileNumber
                      ? "Mobile Number is required"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.address}
                  helperText={
                    validationErrors.address ? "Address is required" : ""
                  }
                />
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 2, mb: 2 }} align="center">
              LOAN DETAILS
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="principle"
                  name="principle"
                  value={formData.loanAmount}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.items}
                  helperText={validationErrors.items ? "Item  is required" : ""}
                />
              </Grid>{" "}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.items}
                  helperText={validationErrors.items ? "Item  is required" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Items"
                  name="items"
                  value={formData.items}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.items}
                  helperText={validationErrors.items ? "Item  is required" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Quality"
                  name="quality"
                  value={formData.quality}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.quality}
                  helperText={
                    validationErrors.quality ? "Quality  is required" : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.quantity}
                  helperText={
                    validationErrors.quantity ? "Quantity  is required" : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Total Weight (GMS)"
                  name="totalWeightGms"
                  value={formData.totalWeightGms}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.totalWeightGms}
                  helperText={
                    validationErrors.totalWeightGms
                      ? "Total weight  is required"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Gross"
                  name="gross"
                  value={formData.gross}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.gross}
                  helperText={
                    validationErrors.gross ? "Gross  is required" : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Net"
                  name="net"
                  value={formData.net}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.net}
                  helperText={validationErrors.net ? "Net  is required" : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Rupees in Words"
                  name="rupeesInWords"
                  value={formData.rupeesInWords}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.rupeesInWords}
                  helperText={
                    validationErrors.rupeesInWords
                      ? "Rupees in word  is required"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Agreement Signed and Cash Received (Rs)"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.loanAmount}
                  helperText={
                    validationErrors.loanAmount
                      ? "Cash amount  is required"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {authorizedFile ? (
                  <div style={{ position: "relative", textAlign: "center" }}>
                    <img
                      src={URL.createObjectURL(authorizedFile)}
                      alt="Authorized Sign"
                      style={{ width: "90%", height: "60px" }}
                    />
                    <IconButton
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "rgba(255, 255, 255, 0.7)",
                      }}
                      onClick={handleFileRemove(setAuthorizedFile)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                ) : (
                  <>
                    <Button variant="outlined" component="label" fullWidth>
                      Signature of the customer
                      <input
                        type="file"
                        hidden
                        onChange={handleFileChange(setAuthorizedFile)}
                      />
                    </Button>
                    {validationErrors.authorizedFile && (
                      <Typography color="error" variant="caption">
                        signature of the customer is required
                      </Typography>
                    )}
                  </>
                )}
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 2, mb: 2 }} align="center">
              PAYMENT DETAILS
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="No"
                  name="paymentNo"
                  value={formData.paymentNo}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  disabled={formDisabled}
                  error={validationErrors.paymentNo}
                  helperText={
                    validationErrors.paymentNo
                      ? "Payment number  is required"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Schema"
                  name="schema"
                  value={formData.schema}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.schema}
                  helperText={
                    validationErrors.schema ? "schema  is required" : ""
                  }
                />
              </Grid>{" "}
              <Grid item xs={12} sm={6} md={4} className="percent-hide">
                <TextField
                  label="percent"
                  name="percent"
                  value={formData.percent}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.percent}
                  helperText={
                    validationErrors.percent ? "percent  is required" : ""
                  }
                  className="percent-hide"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Date"
                  name="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.paymentDate}
                  helperText={
                    validationErrors.paymentDate
                      ? "Payment date  is required"
                      : ""
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Receipt No"
                  name="receiptNo"
                  value={formData.receiptNo}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.receiptNo}
                  helperText={
                    validationErrors.receiptNo
                      ? "Receipt number  is required"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Principle paid"
                  name="interestamount"
                  value={formData.interestamount}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.interestamount}
                  helperText={
                    validationErrors.interestamount
                      ? "Interest Amount is required"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="No of Days"
                  name="noOfDays"
                  value={formData.noOfDays}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.noOfDays}
                  helperText={
                    validationErrors.noOfDays
                      ? "Number of days  is required"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Interest Paid"
                  name="interestPrinciple"
                  value={formData.interestPrinciple}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.interestPrinciple}
                  helperText={
                    validationErrors.interestPrinciple
                      ? "Interest   is required"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Balance Principle"
                  name="balancePrinciple"
                  value={formData.balancePrinciple}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.balancePrinciple}
                  helperText={
                    validationErrors.balancePrinciple
                      ? "Balance  is required"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.remarks}
                  helperText={
                    validationErrors.remarks ? "Remarks  is required" : ""
                  }
                />
              </Grid>
            </Grid>

            <Grid
              container
              spacing={2}
              justifyContent="space-between"
              sx={{ mt: 2 }}
            >
              <Grid item xs={12} sm={6} md={3}>
                {customersign ? (
                  <div style={{ position: "relative", textAlign: "center" }}>
                    <img
                      src={URL.createObjectURL(customersign)}
                      alt="Authorized Sign"
                      style={{ width: "90%", height: "60px" }}
                    />
                    <IconButton
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "rgba(255, 255, 255, 0.7)",
                      }}
                      onClick={handleFileRemove(setCustomersign)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      className="bill-button"
                    >
                      Customer Signature
                      <input
                        type="file"
                        hidden
                        onChange={handleFileChange(setCustomersign)}
                      />
                    </Button>
                    {validationErrors.customersign && (
                      <Typography color="error" variant="caption">
                        Customer signature is required
                      </Typography>
                    )}
                  </>
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {cashiersign ? (
                  <div style={{ position: "relative", textAlign: "center" }}>
                    <img
                      src={URL.createObjectURL(cashiersign)}
                      alt="Authorized Sign"
                      style={{ width: "90%", height: "60px" }}
                    />
                    <IconButton
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "rgba(255, 255, 255, 0.7)",
                      }}
                      onClick={handleFileRemove(setCashiersign)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      className="bill-button"
                    >
                      Cashier Signature
                      <input
                        type="file"
                        hidden
                        onChange={handleFileChange(setCashiersign)}
                      />
                    </Button>
                    {validationErrors.cashiersign && (
                      <Typography color="error" variant="caption">
                        Cashier signature is required
                      </Typography>
                    )}
                  </>
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  name="closedate"
                  label="Loan Closure Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formData.closedate}
                  onChange={handleInputChange}
                  error={validationErrors.closedate}
                  helperText={
                    validationErrors.closedate
                      ? "Loan Closure Date is required"
                      : ""
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={formDisabled}
                style={{ marginRight: "10px" }}
              >
                Submit
              </Button>
            </Grid>
          </form>
        </Paper>
      </div>
      <div style={{ padding: "20px", marginTop: "20px" }}>
        <Paper
          elevation={2}
          style={{ padding: "20px" }}
          sx={{ maxWidth: 800, margin: "auto" }}
          className="paperbg"
        >
          <form onSubmit={handleSubmit}></form>

          <TableContainer component={Paper}>
            <Table sx={{ border: "1px solid black" }}>
              <TableHead>
                <TableRow sx={{ border: "1px solid black" }}>
                  <TableCell sx={{ border: "1px solid black" }}>Date</TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    className="disables"
                  >
                    Amount
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    className="disables"
                  >
                    Interest
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    className="disables"
                  >
                    Total Amount
                  </TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>
                    CustomerID
                  </TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>
                    No of Days
                  </TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>
                    Interest
                  </TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>
                    Principal
                  </TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>
                    Balance
                  </TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {row.paymentDate}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      className="disables"
                    >
                      {row.loanAmount}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      className="disables"
                    >
                      {row.interest}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      className="disables"
                    >
                      {row.totalAmount}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {row.customerId}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {row.noOfDays}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {row.interestPrinciple}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {row.interestamount}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {row.balance}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        className="report-button"
                        onClick={() => handleSave(row)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        className="report-button"
                        onClick={() => handlePrint(row)} // Pass the current row
                      >
                       Voucher
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <PrintDialog
  open={openDialog}
  onClose={handleCloseDialog}
  data={selectedRow}
/>

        </Paper>
      </div>
    </>
  );
};

export default Report;
