import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  MenuItem,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./Master.css";
import Badge from "react-bootstrap/Badge";
import Swal from "sweetalert2";
import axios from "axios";
const Master = () => {
  const [nextLoanNumber, setNextLoanNumber] = useState("");
  const [latestJewelNumber, setLatestJewelNumber] = useState("");
  const [schemas, setSchemas] = useState([]);
  const [formData, setFormData] = useState({
    customerId: "",
    loanNumber: "",
    date: "",
    jlNumber: "",
    customerName: "",
    mobileNumber1: "",
    mobileNumber2: "",
    landmark: "",
    address: "",
    jDetails: "",
    quality: "",
    quantity: "",
    iw: "",
    gw: "",
    nw: "",
    schema: "",
    loanAmount: "",
    percent: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    customerId: false,
    loanNumber: false,
    date: false,
    jlNumber: false,
    customerName: false,
    mobileNumber1: false,
    mobileNumber2: false,
    landmark: false,
    address: false,
    jDetails: false,
    quality: false,
    quantity: false,
    iw: false,
    gw: false,
    nw: false,
    schema: false,
    loanAmount: false,
    percent: false,
  });
  const [latestLoanNumber, setLatestLoanNumber] = useState("");
  const [enableCustomerId, setEnableCustomerId] = useState(false);
  const [proof, setProof] = useState(null);

  const handleCheckboxChange = () => {
    setEnableCustomerId(!enableCustomerId);
  };
  useEffect(() => {
    // Fetch latest loan number on component mount
    fetchLatestLoanNumber();
    fetchSchemas();
  }, []);

  const fetchLatestLoanNumber = () => {
    fetch("http://localhost:5000/api/ledger/latest_loan_number")
      .then((response) => response.json())
      .then((data) => {
        setLatestLoanNumber(data.latestLoanNumber);
      })
      .catch((error) =>
        console.error("Error fetching latest loan number:", error)
      );
  };

  useEffect(() => {
    fetchLatestJewelNumber();
  }, []);

  const fetchLatestJewelNumber = () => {
    fetch("http://localhost:5000/api/ledger/next_jewel_number")
      .then((response) => response.json())
      .then((data) => {
        setLatestJewelNumber(data.nextJewelNumber);
        setFormData((prevState) => ({
          ...prevState,
          jlNumber: data.nextJewelNumber, // Set jlNumber in formData
        }));
      })
      .catch((error) =>
        console.error("Error fetching latest jewel number:", error)
      );
  };
  const fetchSchemas = () => {
    console.log("Fetching schemas...");

    fetch("http://localhost:5000/api/schemas")
      .then((response) => response.json())
      .then((data) => {
        console.log("Data received:", data);
        setSchemas(data); // Store the full schema objects
      })
      .catch((error) => {
        console.error("Error fetching schemas:", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => {
      const newFormData = { ...prevState, [name]: value };

      // Handle schema change
      if (name === "schema") {
        const selectedSchema = schemas.find((schema) => schema.name === value);
        if (selectedSchema) {
          newFormData.percent = selectedSchema.interestPercent; // Update percent
        } else {
          newFormData.percent = ""; // Clear percent if no schema is selected
        }
      }

      // Customer ID generation logic
      if (name === "customerName" || name === "mobileNumber1") {
        const { customerName, mobileNumber1 } = newFormData;
        if (customerName && mobileNumber1 && mobileNumber1.length === 10) {
          const customerId = `${customerName
            .slice(0, 3)
            .toUpperCase()}${mobileNumber1.slice(-4).toUpperCase()}`;
          newFormData.customerId = customerId;
        } else {
          newFormData.customerId = "";
        }
      }

      // Validations
      if (name === "loanNumber") {
        const pattern = /^KRT\d{3,}$/;
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: !pattern.test(value),
        }));
      } else if (name === "mobileNumber1" || name === "mobileNumber2") {
        const pattern = /^\d{10}$/;
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: !pattern.test(value),
        }));
      } else if (name === "schema" || name === "landmark") {
        const pattern = /^[a-zA-Z\s]*$/;
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: !pattern.test(value),
        }));
      } else if (name === "address") {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: value.trim().length <= 10,
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: value.trim() === "",
        }));
      }

      return newFormData;
    });
  };

  const handleFileChange = (setter) => (e) => {
    const selectedFile = e.target.files[0];
    setter(selectedFile);
  };

  const handleFileRemove = (setter) => () => {
    setter(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithJLNumber = { ...formData, jlNumber: latestJewelNumber };
    let valid = true;
    let updatedErrors = { ...validationErrors };

    // Check required fields and validations
    for (let key in formData) {
      if (formData[key].trim() === "") {
        updatedErrors[key] = true;
        valid = false;
      } else if (key === "mobileNumber1" || key === "mobileNumber2") {
        const pattern = /^\d{10}$/;
        if (!pattern.test(formData[key])) {
          updatedErrors[key] = true;
          valid = false;
        }
      } else if (key === "schema" || key === "landmark") {
        const pattern = /^[a-zA-Z\s]*$/;
        if (!pattern.test(formData[key])) {
          updatedErrors[key] = true;
          valid = false;
        }
      } else if (key === "address" && formData[key].trim().length <= 10) {
        updatedErrors[key] = true;
        valid = false;
      }
    }

    // Check if loanNumber matches latestLoanNumber
    if (formData.loanNumber !== latestLoanNumber) {
      updatedErrors.loanNumber = true;
      valid = false;
    }

    setValidationErrors(updatedErrors);

    if (valid) {
      // Create a new FormData instance
      const formData = new FormData();

      // Append form data fields
      for (const [key, value] of Object.entries(formDataWithJLNumber)) {
        formData.append(key, value);
      }

      // Append proof file if it exists
      if (proof) {
        formData.append("proof", proof); // Ensure 'proof' matches the backend multer setup
      }
     

      try {
        const response = await fetch("http://localhost:5000/api/ledger/add", {
          method: "POST",
          body: formData, // Use FormData here
        });

        const data = await response.json();
        console.log("Success:", data);

        // Show SweetAlert success message
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Ledger entry stored successfully.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        }).then(() => {
          setNextLoanNumber(nextLoanNumber + 1);
          fetchLatestLoanNumber();
          fetchLatestJewelNumber();
          setFormData({
            // Reset form data
            loanNumber: nextLoanNumber,
            customerId: "",
            date: "",
            jlNumber: "",
            customerName: "",
            mobileNumber1: "",
            mobileNumber2: "",
            landmark: "",
            address: "",
            jDetails: "",
            quality: "",
            quantity: "",
            iw: "",
            gw: "",
            nw: "",
            schema: "",
            loanAmount: "",
            percent:"",
            proof:"",
          });
        });
      } catch (error) {
        console.error("Error:", error);
        // Show SweetAlert error message
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      }
    } else {
      // Show validation error message
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please check all fields and ensure the loan number matches the latest loan number.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
  };
  const fetchCustomerDetails = async (customerId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/ledger/${customerId}`
      );
      const customer = response.data;
      setFormData({
        ...formData,
        customerName: customer.customerName,
        mobileNumber1: customer.mobileNumber1,
        mobileNumber2: customer.mobileNumber2,
        landmark: customer.landmark,
        address: customer.address,
      });
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };
  const handleCustomerIdChange = (e) => {
    const customerId = e.target.value;
    setFormData({
      ...formData,
      customerId: customerId,
    });
    if (customerId.length === 7) {
      fetchCustomerDetails(customerId);
    }
  };
  return (
    <Container sx={{ mt: 8 }}>
      <Paper style={{ padding: 20 }} className="paperbg">
        <Typography variant="h4" gutterBottom align="center">
          Ledger Form
        </Typography>
        <Grid
          item
          xs={12}
          sm={2}
          style={{ textAlign: "center" }}
          sx={{ mb: 2 }}
        >
          <Button variant="contained" color="primary" className="cate-btn">
            Next LoanNo:
            <Badge bg="warning" className="cate ">
              {latestLoanNumber}
            </Badge>
          </Button>
        </Grid>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="customerId"
                label="Customer Id"
                fullWidth
                value={formData.customerId}
                onChange={handleCustomerIdChange}
                disabled={!enableCustomerId}
                error={validationErrors.customerId}
                helperText={
                  validationErrors.customerId ? "Customer Id is required" : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="loanNumber"
                label="Loan Number"
                fullWidth
                value={formData.loanNumber}
                onChange={handleChange}
                error={validationErrors.loanNumber}
                helperText={
                  validationErrors.loanNumber
                    ? "Loan Number must start with 'kRT' followed by at least 3 digits"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="date"
                label="Date"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.date}
                onChange={handleChange}
                error={validationErrors.date}
                helperText={validationErrors.date ? "Date is required" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="customerName"
                label="Customer Name"
                fullWidth
                value={formData.customerName}
                onChange={handleChange}
                error={validationErrors.customerName}
                helperText={
                  validationErrors.customerName
                    ? "Customer Name is required"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="mobileNumber1"
                label="Mobile Number"
                fullWidth
                value={formData.mobileNumber1}
                onChange={handleChange}
                error={validationErrors.mobileNumber1}
                helperText={
                  validationErrors.mobileNumber1
                    ? "Mobile Number must be 10 digits"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="jlNumber"
                label="Jewel Number"
                fullWidth
                value={formData.jlNumber}
                onChange={handleChange}
                error={validationErrors.jlNumber}
                helperText={
                  validationErrors.jlNumber ? "Jewel Number is required" : ""
                }
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="mobileNumber2"
                label="Alternative Mobile Number"
                fullWidth
                value={formData.mobileNumber2}
                onChange={handleChange}
                error={validationErrors.mobileNumber2}
                helperText={
                  validationErrors.mobileNumber2
                    ? "Mobile Number must be 10 digits"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="landmark"
                label="Landmark"
                fullWidth
                value={formData.landmark}
                onChange={handleChange}
                error={validationErrors.landmark}
                helperText={
                  validationErrors.landmark ? "Landmark must be a string" : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                fullWidth
                multiline
                rows={2}
                value={formData.address}
                onChange={handleChange}
                error={validationErrors.address}
                helperText={
                  validationErrors.address
                    ? "Address must be greater than 10 characters"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="jDetails"
                label="Jewel Details"
                fullWidth
                value={formData.jDetails}
                onChange={handleChange}
                error={validationErrors.jDetails}
                helperText={
                  validationErrors.jDetails ? "Jewel Details are required" : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="quality"
                label="Quality"
                fullWidth
                value={formData.quality}
                onChange={handleChange}
                error={validationErrors.quality}
                helperText={
                  validationErrors.quality ? "Quality is required" : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="quantity"
                label="Quantity"
                fullWidth
                value={formData.quantity}
                onChange={handleChange}
                error={validationErrors.quantity}
                helperText={
                  validationErrors.quantity ? "Quantity is required" : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="iw"
                label="Item Weight (gms)"
                fullWidth
                value={formData.iw}
                onChange={handleChange}
                error={validationErrors.iw}
                helperText={
                  validationErrors.iw ? "Item Weight is required" : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="gw"
                label="Gross Weight (gms)"
                fullWidth
                value={formData.gw}
                onChange={handleChange}
                error={validationErrors.gw}
                helperText={
                  validationErrors.gw ? "Gross Weight is required" : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="nw"
                label="Net Weight (gms)"
                fullWidth
                value={formData.nw}
                onChange={handleChange}
                error={validationErrors.nw}
                helperText={validationErrors.nw ? "Net Weight is required" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                label="Schema"
                name="schema"
                value={formData.schema}
                onChange={handleChange}
                fullWidth
                select
                error={!!validationErrors.schema}
                helperText={validationErrors.schema && "Schema is required"}
              >
                {schemas.map((schema) => (
                  <MenuItem key={schema._id} value={schema.name}>
                    {schema.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={1}>
              <TextField
                name="percent"
                label="%"
                fullWidth
                value={formData.percent}
                onChange={handleChange}
                error={!!validationErrors.percent}
                helperText={
                  validationErrors.percent ? "Interest percent is required" : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="loanAmount"
                label="Loan Amount"
                fullWidth
                value={formData.loanAmount}
                onChange={handleChange}
                error={validationErrors.loanAmount}
                helperText={
                  validationErrors.loanAmount ? "Loan Amount is required" : ""
                }
              />
            </Grid>
          </Grid>
          <Grid container justify="center" style={{ marginTop: "20px" }}>
            <Grid item xs={12} align="center">
              {proof ? (
                <div style={{ position: "relative", textAlign: "center" }}>
                  <img
                    src={URL.createObjectURL(proof)}
                    alt="proof"
                    style={{ width: "70%", height: "260px" }}
                  />
                  <IconButton
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: "rgba(255, 255, 255, 0.7)",
                    }}
                    onClick={handleFileRemove(setProof)}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              ) : (
                <>
                  <Box display="flex" justifyContent="center" mt={2}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      align="center"
                    >
                      Customer Proof Uploads
                      <input
                        type="file"
                        hidden
                        onChange={handleFileChange(setProof)}
                      />
                    </Button>
                  </Box>
                  {validationErrors.authorizedFile && (
                    <Typography color="error" variant="caption">
                      signature of the customer is required
                    </Typography>
                  )}
                </>
              )}
            </Grid>
            <Grid item xs={12} sx={{ mt: 3 }} align="center">
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Master;
