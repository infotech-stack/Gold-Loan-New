import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Paper,
  Grid,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import "./Books.css";
import image from "../../src/Navbar/KRT Gold Finance Logo PNG File.png";
import { toWords } from "number-to-words";
import swal from 'sweetalert';

const Books = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [customerData, setCustomerData] = useState({
    date: "",
    customerId: "",
    customerName: "",
    loanNumber: "",
    jlNumber: "",
    fatherName: "",
    address: "",
    mobile: "",
    loanAmount: "",
    rupeesInWords: "",
    mobileNumber1: "",
    loanDate: "",
    jDetails: "",
    quantity: "",
    iw: "",
    schema: "",
    lastDateForLoan: "",
    percent:"",
  });

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const getLabels = (id) => {
    switch (selectedLanguage) {
      case "tamil":
        switch (id) {
          case "date":
            return <Typography className="font-tamil">தேதி</Typography>;
          case "customerId":
            return (
              <Typography className="font-tamil">வாடிக்கையாளர் ஐடி</Typography>
            );
          case "customerName":
            return (
              <Typography className="font-tamil">
                வாடிக்கையாளர் பெயர்
              </Typography>
            );
          case "loanNumber":
            return <Typography className="font-tamil">கடன் எண்</Typography>;
          case "jewelNo":
            return <Typography className="font-tamil">நகை எண்</Typography>;
          case "fatherName":
            return (
              <Typography className="font-tamil">கணவன்/தந்தை பெயர்</Typography>
            );
          case "address":
            return <Typography className="font-tamil">முகவரி</Typography>;
          case "mobile":
            return <Typography className="font-tamil">கைப்பேசி எண்</Typography>;
          case "loanAmount":
            return <Typography className="font-tamil">கடன் தொகை</Typography>;
          case "rupeesInWords":
            return <Typography className="font-tamil">எழுத்தால்</Typography>;
          case "loanDate":
            return <Typography className="font-tamil">கடன் தேதி</Typography>;
          case "jewelDetails":
            return (
              <Typography className="font-tamil">நகை விவரங்கள்</Typography>
            );
          case "quantity":
            return <Typography className="font-tamil">எண்ணிக்கை</Typography>;
          case "weight":
            return <Typography className="font-tamil">எடை</Typography>;
          case "lastDateForLoan":
            return (
              <Typography className="font-tamil">கடன் கடைசி தேதி</Typography>
            );
          case "companyName":
            return (
              <Typography className="font-tamill">
                கேஆர்டி கோல்டு பைனான்ஸ்
              </Typography>
            );
          case "cellNumbers":
            return (
              <Typography className="font-tamil">
                செல் நம்பர்: 9042425142, 9042425642
              </Typography>
            );
          case "addressLine1":
            return (
              <Typography className="font-tamil">
                135/5, வேலவன் காம்ப்ளெக்ஸ், (M.G.N லாட்ஜ் அருகில்) சேலம் மெயின்
                ரோடு
              </Typography>
            );
          case "addressLine2":
            return (
              <Typography className="font-tamil">
                கொமாரபாளையம் - 638 183,நாமக்கல் Dt
              </Typography>
            );
          case "condition":
            return (
              <Typography className="font-tamil">
                1. நான் மேலே குறிப்பிட்டுள்ள தங்க நகைகளை ஈடாக தருகிறேன். 2. இந்த
                நகைகள் என்னுடையவை. 3. நான் கடன் தொகை மற்றும் வட்டி சேர்த்து
                மறுபக்கத்தில் குறிப்பிட்டுள்ள கால அவகாசத்திற்குள் திருப்பி
                அடைக்க சம்மதிக்கிறேன். 4. இந்த படிவத்தில் குறிப்பிட்டுள்ள யாவும்
                உண்மையென நான் உறுதி கூறுகிறேன். 5. பின் பக்கத்தில்
                கொடுத்திருக்கும் நிபந்தனைகளையும், விதிமுறைகளையும்
                ஏற்றுக்கொள்கிறேன்.
              </Typography>
            );
          case "heading1":
            return (
              <Typography className="font-tamil">
                {" "}
                1. நீங்கள் ஈடாக அடகு வைத்திருக்கும் பொருளுக்கு கூடுதல்
                மதிப்பீட்டை வைத்து உங்கள் வட்டி நிர்ணயிக்கப்படுகிறது.
              </Typography>
            );
          case "heading2":
            return (
              <Typography className="font-tamil">
                {" "}
                2. அடகு வைத்த தேதியிலிருந்து ஒரு வருடத்திற்குள் / ஆறு
                மாதத்திற்குள் நகைகளை திருப்பவோ அல்லது வட்டி கட்டி மாற்றி
                புதுப்பித்து கொள்ளவும், தவறும் பட்சத்தில் அடுத்து வரும்
                நாட்களில் தங்களது நகைக்கடனின் வட்டி விகிதம் மாறும். மேற்கொண்டு
                தவறும் பட்சத்தில் தங்களின் நகைகளை பகிரங்க ஏலத்தில் விடப்படும்.
              </Typography>
            );
          case "heading3":
            return (
              <Typography className="font-tamil">
                {" "}
                3. அடகு கடன் பெற்றவர்களுக்கு அனுப்பப்படும் தபால்கள், இதர
                செலவுகள் அனைத்தும் தங்களின் கடன் கணக்கிலேயே சேரும்.
              </Typography>
            );
          case "heading4":
            return (
              <Typography className="font-tamil">
                {" "}
                4. நான் / நாங்கள் அடமானமாக வைக்க தங்கள் நிறுவனத்திற்கு கொண்டு
                வந்து இருக்கும் நகைகள் அனைத்தும் என்னுடைய / எங்களுடைய சொந்த
                நகைகள் என்பதை உறுதியுடன் தெரிவித்துக் கொள்கிறேன் / றோம்.
              </Typography>
            );
          case "heading5":
            return (
              <Typography className="font-tamil">
                {" "}
                5. தங்களது முகவரி மற்றும் அலைபேசி எதுவும் மாற்றம் இருந்தால் அதை
                உடனடியாக நிர்வாகத்திற்கு தெரியப்படுத்த வேண்டும். தவறும்
                பட்சத்தில் நிர்வாகம் பொறுப்பேற்காது.
              </Typography>
            );
          case "heading6":
            return (
              <Typography className="font-tamil">
                {" "}
                6. தங்களது நகைக்கடன் ரசீது தொலைந்து போனால் நிர்வாகம் கேட்கும்
                சான்றிதழ்கள் கொடுக்க சம்மதம் தெரிவிக்கிறேன் / றோம்.
              </Typography>
            );
          case "heading7":
            return (
              <Typography className="font-tamil">
                {" "}
                7. தங்கள் எனக்கு வழங்கிய தங்கத்திற்கு அதிகப்படியான நகைகடனுக்கு
                தங்கத்தின் விலை சரிவு ஏற்பட்டால் அதுக்கு ஈடாக தங்களது நிர்வாகம்
                கேட்கும் தொகை உடனடியாக திருப்பி செலுத்தி விடுகிறேன். தவறும்
                பட்சத்தில் என் நகையின் மேல் நிர்வாகம் எடுக்கும் முடிவுக்கு
                முழுமனதுடன் சம்மதம் தெரி விக்கிறேன். மேற்கண்ட நிபந்தனைகளுக்கு
                முழு சம்மதம் தெரிவிக்கிறேன் /றோம்.
              </Typography>
            );
          case "heading8":
            return (
              <Typography className="font-tamil">
                {" "}
                *அரசு விடுமுறை நாட்களில் நகைகளை திருப்ப முடியாது.
              </Typography>
            );
          case "heading9":
            return (
              <Typography className="font-tamil">
                {" "}
                *நகையை திரும்ப பெற வரும் பொழுது இந்த ரசீதுடன் நகைக்கு
                சொந்தமானவர்கள் வந்தால் மட்டுமே நகையை திரும்ப பெற முடியும்.
              </Typography>
            );
          case "heading10":
            return (
              <Typography className="font-tamil">
                {" "}
                பிற நிறுவனத்தில் இருக்கும் தங்க நகைகள் விற்க / அடகு வைக்க
                அணுகவும்.
              </Typography>
            );
          case "heading11":
            return (
              <Typography className="font-tamil"> பொது மேலாளர்</Typography>
            );
          case "heading12":
            return (
              <Typography className="font-tamil"> கடன் மேலாளர்</Typography>
            );
          case "heading13":
            return (
              <Typography className="font-tamil">
                {" "}
                நகை மதிப்பீட்டாளர்
              </Typography>
            );
          case "heading14":
            return <Typography className="font-tamil"> காசாளர்</Typography>;
          case "heading15":
            return (
              <Typography className="font-tamil">
                {" "}
                அடமானம் கொள்பவரின் கையொப்பம் (அல்லது) இடது கை கட்டைவிரல் பதிவு.
              </Typography>
            );
          case "heading16":
            return (
              <Typography className="font-tamil">
                {" "}
                நகை பெறுவோரின் கையொப்பம் 
                திட்டம்
              </Typography>
            );
            case "schema":
              return (
                <Typography className="font-tamil">
                  {" "}
            
                  திட்டம்
                </Typography>
              );
              case "percent":
                return (
                  <Typography className="font-tamil">
                    {" "}
              
                    சதவீதம்
                  </Typography>
                );
          default:
            return "";
        }
      default:
        // Default to English
        switch (id) {
          case "date":
            return "Date";
          case "customerId":
            return "Customer ID";
          case "customerName":
            return "Customer Name";
          case "loanNumber":
            return "Loan Number";
          case "jewelNo":
            return "Jewel Number";
          case "fatherName":
            return "Father/Husband Name";
          case "address":
            return "Address";
          case "mobile":
            return "Mobile Number";
          case "loanAmount":
            return "Loan Amount";
          case "rupeesInWords":
            return "Rupees in Words";
          case "loanDate":
            return "Loan Date";
          case "jewelDetails":
            return "Jewel Details";
          case "quantity":
            return "Quantity";
          case "weight":
            return "Weight";
          case "lastDateForLoan":
            return "Last Date For Loan";
          case "companyName":
            return "KRT GOLD FINANCE";
          case "cellNumbers":
            return "Cell No: 9042425142, 9042425642";
          case "addressLine1":
            return "135/5 Velavan Complex, Near (MGN) Lodge, Salem Main Road,";
          case "addressLine2":
            return "Komarapalayam-638183,Namakkal dist ";
          case "condition":
            return "1. The loan amount will be disbursed as per the terms and  conditions.2.Interest will be charged as per the agreement.3.Any delay in repayment will incur penalties.4.The borrower  should provide necessary documents as required.5.The loan is  subject to approval by the management.";
          case "heading1":
            return "1. Your interest is determined by adding value to the property you are pledging.";
          case "heading2":
            return "2. To return the jewelery within one year / six months from the date of pledge or to renew with interest, failing which the interest rate of your jewelery loan will change in the following days. In case of further failure, their jewels will be auctioned.";
          case "heading3":
            return "3. All postage and other expenses sent to the mortgagee will be credited to their loan account.";
          case "heading4":
            return "4. I / We hereby declare that all the jewelery which I / we are bringing to your company for pawning is my / our own jewellery.";
          case "heading5":
            return "5. If there is any change in your address and phone number, you should inform the management immediately. Management will not be held responsible in case of failure.";
          case "heading6":
            return "6. In case of loss of their jewelery loan receipt, I agree to provide the certificates requested by the management.";
          case "heading7":
            return "7.In case of a fall in the price of gold, I will immediately repay the amount demanded by their management. In case of mistake, I wholeheartedly consent to the management's decision on my jewelry. I fully agree to the above conditions.";
          case "heading8":
            return "*Jewelry cannot be returned on public holidays.";
          case "heading9":
            return "*The jewelery can be returned only if the owner of the jewelery comes with this receipt when coming to return the jewellery.";
          case "heading10":
            return "Will be in other company Sell / Pawn Gold Jewellery ";
          case "heading11":
            return "General Manager";
          case "heading12":
            return "Credit Manager";
          case "heading13":
            return "Jewellery Appraiser";
          case "heading14":
            return "Cashier ";
          case "heading15":
            return "Signature of mortgagor (or) left hand thumb impression.";
          case "heading16":
            return "of jewelers Signature ";
          case "schema":
            return "schema";
case "percent":
  return"percent";
          default:
        }
    }
  };

  const fetchCustomerData = async (customerId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/ledger/${customerId}`
      );
      const customer = response.data;
      
      // Check if date is valid before creating Date object
      const date = new Date(customer.date);
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", customer.date);
        return;
      }
      
      const formattedDate = date.toISOString().split('T')[0];
      const loanAmountInWords = toWords(customer.loanAmount);
      
      setCustomerData({
        ...customer,
        date: formattedDate, // Update date with formatted value
        rupeesInWords: loanAmountInWords,
      });
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  const handleCustomerIdChange = (event) => {
    const customerId = event.target.value;
    setCustomerData((prevState) => ({
      ...prevState,
      customerId,
    }));
    fetchCustomerData(customerId);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "date") {
      const formattedDate = value; // Already in the correct format
      setCustomerData((prevState) => ({
        ...prevState,
        [name]: formattedDate,
      }));
    }
  };
  const handlePrint = () => {
    window.print();
  };
  const saveCustomerData = async () => {
    try {
        console.log('Sending customer data:', customerData); // Log the data to check its structure
        const response = await axios.post('http://localhost:5000/api/customers/create', customerData);
        console.log('Customer saved:', response.data);

        // Show success message using SweetAlert
        swal("Success", "Customer data has been saved successfully...Take a Print out As you need !", "success");

        // Optionally clear the form
        setCustomerData({
            date: "",
            customerId: "",
            customerName: "",
            loanNumber: "",
            jlNumber: "",
            fatherName: "",
            address: "",
            loanAmount: "",
            rupeesInWords: "",
            mobileNumber1: "",
            jDetails: "",
            quantity: "",
            iw: "",
            schema: "",
            percent: "",
            lastDateForLoan: "",
        });
    } catch (error) {
        console.error('Error saving customer data:', error.response ? error.response.data : error.message);

        // Optionally show error message using SweetAlert
        swal("Error", "There was an error saving the customer data. Please try again.", "error");
    }
};

  
  return (
    <>
      <div style={{ padding: "20px", marginTop: "70px" }} className="billbook">
        <Paper
          elevation={2}
          style={{ padding: "20px" }}
          sx={{ maxWidth: 700, margin: "auto" }}
          className="paperbg2"
        >
          <Grid container spacing={2} justifyContent="center">
            {/* Logo and Company Information */}
            <Grid item xs={12} sm={4}>
              <img
                src={image}
                alt="Logo"
                style={{ width: "70%", height: "auto" }}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography
                variant="h6"
                align="center"
                gutterBottom
                sx={{ mt: 2 }}
              >
                {getLabels("companyName")}
              </Typography>
              <Typography variant="subtitle1" align="center">
                {getLabels("cellNumbers")}
              </Typography>
              <Typography variant="body1" align="center" gutterBottom>
                {getLabels("addressLine1")}
                {getLabels("addressLine2")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="language-select-label">Language</InputLabel>
                    <Select
                      labelId="language-select-label"
                      id="language-select"
                      value={selectedLanguage}
                      onChange={handleLanguageChange}
                      label="Language"
                    >
                      <MenuItem value="english">English</MenuItem>
                      <MenuItem value="tamil">தமிழ்</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    id="customerId"
                    label={getLabels("customerId")}
                    variant="outlined"
                    value={customerData.customerId}
                    onChange={handleCustomerIdChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
              <TextField
                label="Date"
                name="date"
                type="date"
                value={customerData.date}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    id="customerName"
                    label={getLabels("customerName")}
                    variant="outlined"
                    value={customerData.customerName}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        customerName: e.target.value,
                      })
                    }
                  />
                </Grid>

                {/* Second Row: Loan Number, Jewel No, Father/Husband Name */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    id="loanNumber"
                    label={getLabels("loanNumber")}
                    variant="outlined"
                    value={customerData.loanNumber}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        loanNumber: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    id="jewelNo"
                    label={getLabels("jewelNo")}
                    variant="outlined"
                    value={customerData.jlNumber}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        jewelNo: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    id="fatherName"
                    label={getLabels("fatherName")}
                    variant="outlined"
                    value={customerData.fatherName}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        fatherName: e.target.value,
                      })
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    id="mobile"
                    label={getLabels("mobile")}
                    variant="outlined"
                    value={customerData.mobileNumber1}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        mobile: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    id="loanAmount"
                    label={getLabels("loanAmount")}
                    variant="outlined"
                    value={customerData.loanAmount}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        loanAmount: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="schema"
                    label={getLabels("schema")}
                    variant="outlined"
                    value={customerData.schema}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        customerName: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="percent"
                    label={getLabels("percent")}
                    variant="outlined"
                    value={customerData.percent}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        customerName: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="address"
                    label={getLabels("address")}
                    variant="outlined"
                    multiline
                    rows={2}
                    value={customerData.address}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        address: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="rupeesInWords"
                    label={getLabels("rupeesInWords")}
                    variant="outlined"
                    multiline
                    rows={2}
                    value={customerData.rupeesInWords}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        rupeesInWords: e.target.value,
                      })
                    }
                  />
                </Grid>
                {/* Fourth Row: Mobile Number, Loan Amount, Rupees in Words */}
              </Grid>
            </Grid>

            {/* Table Section */}
            <Grid item xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ border: "1px solid black" }}>
                        {getLabels("jewelDetails")}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        {getLabels("quantity")}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        {getLabels("weight")}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        {getLabels("lastDateForLoan")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ border: "1px solid black" }}>
                        <TextField
                          fullWidth
                          value={customerData.jDetails}
                          sx={{ width: 190 }}
                          multiline
                          rows={2}
                          onChange={(e) =>
                            setCustomerData({
                              ...customerData,
                              jDetails: e.target.value,
                            })
                          }
                        />
                      </TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={1}
                          value={customerData.quantity}
                          onChange={(e) =>
                            setCustomerData({
                              ...customerData,
                              quantity: e.target.value,
                            })
                          }
                        />
                      </TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={1}
                          value={customerData.iw}
                          onChange={(e) =>
                            setCustomerData({
                              ...customerData,
                              iw: e.target.value,
                            })
                          }
                        />
                      </TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        <TextField
                          fullWidth
                          type="date"
                          value={customerData.lastDateForLoan}
                          onChange={(e) =>
                            setCustomerData({
                              ...customerData,
                              lastDateForLoan: e.target.value,
                            })
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {getLabels("condition")}
                </Typography>

                <Grid
                  container
                  spacing={2}
                  justifyContent="center"
                  sx={{ mt: 2 }}
                >
                  <Grid item xs={12} sm={2}>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      {getLabels("heading11")}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      {getLabels("heading12")}
                    </Typography>
                  </Grid>{" "}
                  <Grid item xs={12} sm={2}>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      {getLabels("heading13")}
                    </Typography>
                  </Grid>{" "}
                  <Grid item xs={12} sm={2}>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      {getLabels("heading14")}
                    </Typography>
                  </Grid>{" "}
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      {getLabels("heading15")}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>
      <div style={{ padding: "20px", marginTop: "40px" }} className="billbook">
        <Paper
          elevation={2}
          style={{ padding: "20px" }}
          sx={{ maxWidth: 700, margin: "auto" }}
          className="paperbg2"
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Typography>{getLabels("heading1")}</Typography>
              <Typography>{getLabels("heading2")}</Typography>
              <Typography>{getLabels("heading3")}</Typography>
              <Typography>{getLabels("heading4")}</Typography>
              <Typography>{getLabels("heading5")}</Typography>
              <Typography>{getLabels("heading6")}</Typography>
              <Typography>{getLabels("heading7")}</Typography>
            </Grid>
            <Grid item xs={12} align="center">
              <TableContainer>
                <Table>
                  <TableHead sx={{ border: "1px solid black" }}>
                    <TableRow align="center">
                      {" "}
                      <TableCell
                        align="center"
                        sx={{ border: "1px solid black" }}
                      >
                        <Typography>{getLabels("heading8")}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow align="center">
                      {" "}
                      <TableCell
                        align="center"
                        sx={{ border: "1px solid black" }}
                      >
                        {" "}
                        <Typography>{getLabels("heading9")}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow align="center">
                      {" "}
                      <TableCell sx={{ border: "1px solid black" }}>
                        {" "}
                        <Typography>{getLabels("heading10")}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
              <Grid
                container
                spacing={2}
                justifyContent="center"
                sx={{ mt: 2 }}
              >
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    {getLabels("heading11")}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    {getLabels("heading12")}
                  </Typography>
                </Grid>{" "}
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    {getLabels("heading14")}
                  </Typography>
                </Grid>{" "}
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    {getLabels("heading16")}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePrint}
              className="print-button"
            >
              {getLabels("print")} PRINT
            </Button>
          </Grid>
          <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={saveCustomerData}
        >
          Save
        </Button>
      </Grid>
        </Paper>
      </div>
    </>
  );
};

export default Books;
