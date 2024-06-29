import {
    Avatar, CircularProgress,
    Container,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText, useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { usePatientsData } from "./hooks/usePatientsData";
import PatientProfile from "../profile/PatientProfile.jsx";
import {Phone, RemoveRedEye, Visibility} from "@mui/icons-material";
import {PatientRecordsModal} from "../patients-records/PatientRecordsModal";
import {usePatientRecordsData} from "../patients-records/hooks/usePatientRecords";

export const PatientsTable = () => {
    const { patientsData, handleOpen, selectedPatient,  selectPatient } = usePatientsData();
    const [anchorEl, setAnchorEl] = useState(null);
    const { isRecordsModalOpen, setIsRecordsModalOpen} = usePatientRecordsData();
    const theme = useTheme();

    const handleClick = (event, patient) => {
        setAnchorEl(event.currentTarget);
        handleOpenFiche(patient)
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenFiche = (patient) => {
        console.log("patient", patient)
        handleOpen(patient);
        handleClose();
    };

    const handleOpenCall = (patient) => {
        console.log("patient", patient)
        setIsRecordsModalOpen(true);
        handleClose();
    }

    console.log("patientsData", patientsData, selectedPatient, "isRecordsModalOpen", isRecordsModalOpen)
    if (patientsData.length === 0){
        return <CircularProgress />
    }



    return (
        <Container sx={{ mt: "200px" }}>
            <List>
                {patientsData.map((patient) => (
                    <ListItem  onClick={() => selectPatient(patient)} key={patient.userInfo.id.value} sx={{ borderRadius: '10px', mb: 1, boxShadow: 3 , border : selectedPatient?.userInfo.id.value === patient.userInfo.id.value ? `1px solid ${theme.palette.primary.main}` : "none"}}>
                        <ListItemAvatar>
                            <Avatar alt={patient.userInfo.firstname.value} src={`https://i.pravatar.cc/150?u=${patient.userInfo.id.value}`} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${patient.userInfo.firstname.value} ${patient.userInfo.lastname.value}`}
                            secondary={patient.userInfo.location.value}
                            sx={{ textTransform: 'capitalize' }}
                        />
                        <IconButton edge="end" aria-label="call" onClick={() => handleOpenCall(patient)}>
                            <Phone />
                        </IconButton>
                        <IconButton edge="end" aria-label="details" onClick={(event) => handleClick(event, patient)}>
                            <Visibility />
                        </IconButton>

                    </ListItem>
                ))}
            </List>
            <PatientProfile />
            <PatientRecordsModal />
        </Container>
    );
};

export default PatientsTable;
