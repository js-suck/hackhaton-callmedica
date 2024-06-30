import './App.css';
import { AppBar, Toolbar, IconButton, ThemeProvider, CssBaseline, Container } from "@mui/material";
import {theme} from "./theme/theme.js";
import logo from "./assets/logo.png"
import {PatientDataProvider} from "./features/patients-table/hooks/usePatientsData.tsx";
import {PatientsTable} from "./features/patients-table/PatiensTable.js";
import {PatientRecordsDataProvider} from "./features/patients-records/hooks/usePatientRecords.tsx";
import Chat from "./features/chat/Chat.tsx";


function App() {

    return (
        <ThemeProvider theme={theme}>
        <PatientDataProvider>
            <PatientRecordsDataProvider>
            <CssBaseline />
            <AppBar position="static" color={"black"}>
                <Toolbar sx={{ width: '100%', maxWidth: 'none', justifyContent: 'center' }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <img src={logo} alt="logo" style={{width: '150px', height: '70px'}} />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container sx={{
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                flexDirection: "column"
            }}>

        <PatientsTable />
            </Container>
            </PatientRecordsDataProvider>
            <Chat />
        </PatientDataProvider>

        </ThemeProvider>
    );
}

export default App;
