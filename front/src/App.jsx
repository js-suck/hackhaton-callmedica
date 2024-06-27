import './App.css';
import { AppBar, Toolbar, Typography, IconButton, Button, ThemeProvider, createTheme, CssBaseline, Container, Fab, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {theme} from "./theme/theme.js";
import PatientProfile from "./features/profile/PatientProfile.jsx";
// import {Chat} from "@mui/icons-material";
import Chat from "./features/chat/Chat.jsx";



const sampleData = {
    userInfo: {
        firstName: {
            value: "John",
            source: "practitioner"
        },
        lastName: {
            value: "Doe",
            source: "practitioner"
        },
        email: {
            value: "john.doe@example.com",
            source: "practitioner"
        },
        location: {
            value: "Paris, France",
            source: "practitioner"
        },
        birthDate: {
            value: "1980-05-15",
            source: "practitioner"
        },
        currentAddress: {
            value: "123 Rue de la République, 75001 Paris, France",
            source: "practitioner"
        }
    },
    possibleDiseases: [
        {
            value: "Hypertension",
            source: "AI"
        },
        {
            value: "Diabetes Type 2",
            source: "AI"
        },
        {
            value: "Hypercholesterolemia",
            source: "AI"
        }
    ],
    discoveredDisease: {
        value: "Hypertension",
        source: "AI"
    },
    medicalHistory: [
        {
            value: "Hypertension diagnosed in 2018",
            source: "practitioner"
        },
        {
            value: "Appendectomy in 2005",
            source: "practitioner"
        },
        {
            value: "Family history of diabetes",
            source: "practitioner"
        }
    ],
    currentTreatment: [
        {
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "once daily",
            source: "practitioner"
        },
        {
            name: "Metformin",
            dosage: "500mg",
            frequency: "twice daily",
            source: "practitioner"
        }
    ],
    remarks: {
        value: "Patient reports occasional dizziness and fatigue. Recommended to monitor blood pressure daily and adjust medication dosage if necessary.",
        source: "AI"
    }
}
function App() {
  const userId = 1; 
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar
          sx={{
            width: "100%",
            maxWidth: "none",
            justifyContent: "space-between",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">CallMedica</Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>

      <Chat userId={userId} />
    </ThemeProvider>
  );
}

export default App;
