import React from 'react';
import { Typography, List, Box, Avatar, Modal } from '@mui/material';
import { ProfileItem } from "./ProfileItem";
import { usePatientsData } from "../patients-table/hooks/usePatientsData";

const PatientProfile: React.FC = () => {
    const { selectedPatient: patient, isModalOpen, handleClose } = usePatientsData();

    if (!patient) {
        return null;
    }

    return (
        <Modal open={isModalOpen} aria-labelledby="patient-details-title" aria-describedby="patient-details-description" onClose={handleClose}>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" minWidth={"800px"} textAlign="center" padding={"2%"} borderRadius={"3em"} boxShadow={3} sx={{
                backgroundColor: "white",
                maxWidth: "80%",
                maxHeight: "80%",
                overflowY: 'auto',
                margin: "auto",
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}>
                <Avatar alt="Profile Picture" src={`https://i.pravatar.cc/400?u=${patient.userInfo.id.value}`} sx={{
                    width: "200px",
                    height: "200px",
                    margin: "auto",
                    marginBottom: "16px"
                }} />
                <Typography variant="h1" color={"primary"} margin={'auto'} mb={"8px"}>
                    {patient.userInfo.firstname.value} {patient.userInfo.lastname.value}
                </Typography>
                <Box width="100%" maxWidth="600px">
                    <List>
                        <ProfileItem property={patient.userInfo.firstname} label="First Name" path="userInfo.firstname" />
                        <ProfileItem property={patient.userInfo.lastname} label="Last Name" path="userInfo.lastname" />
                        <ProfileItem property={patient.userInfo.email} label="Email" path="userInfo.email" />
                        <ProfileItem property={patient.userInfo.location} label="Location" path="userInfo.location" />
                        <ProfileItem property={patient.userInfo.birthDate} label="Birth Date" path="userInfo.birthDate" />
                        <ProfileItem property={patient.userInfo.currentAddress} label="Current Address" path="userInfo.currentAddress" />
                    </List>
                </Box>

                {patient.possibleDiseases?.length > 0 && (
                    <>
                        <Typography variant="h2">Possible Diseases</Typography>
                        <Box width="100%" maxWidth="600px">
                            <List>
                                {patient.possibleDiseases?.map((disease, index) => (
                                    <ProfileItem key={index} property={disease} label="Possible Disease" path={`possibleDiseases.${index}`} />
                                ))}
                            </List>
                        </Box>
                    </>
                )}

                {patient.discoveredDisease?.length > 0 && (
                    <>
                        <Typography variant="h2">Discovered Diseases</Typography>
                        <Box width="100%" maxWidth="600px" mb={"16px"}>
                            {patient.discoveredDisease.map((disease, index) => (
                                <ProfileItem key={index} property={disease} label="Discovered Disease" path={`discoveredDisease.${index}`} />
                            ))}
                        </Box>
                    </>
                )}

                {patient.medicalHistory?.length > 0 && (
                    <>
                        <Typography variant="h2">Medical History</Typography>
                        <Box width="100%" maxWidth="600px">
                            <List>
                                {patient.medicalHistory.map((history, index) => (
                                    <ProfileItem key={index} property={history} label="Medical History" path={`medicalHistory.${index}`} />
                                ))}
                            </List>
                        </Box>
                    </>
                )}

                {patient.currentTreatment?.length > 0 && (
                    <>
                        <Typography variant="h2">Current Treatment</Typography>
                        <Box width="100%" maxWidth="600px">
                            <List>
                                {patient.currentTreatment.map((treatment, index) => (
                                    <ProfileItem key={index} property={treatment} label="Current Treatment" path={`currentTreatment.${index}`} />
                                ))}
                            </List>
                        </Box>
                    </>
                )}

                {patient.remark?.length > 0 && (
                    <>
                        <Typography variant="h2">Remarks</Typography>
                        {patient.remark.map((remark, index) => (
                            <Box width="100%" maxWidth="600px" mb={"16px"} key={index}>
                                <ProfileItem property={remark} label="Remarks" path={`remark.${index}`} />
                            </Box>
                        ))}
                    </>
                )}

                <Typography variant="h2">Résumé</Typography>
                <Box width="100%" maxWidth="600px" mb={"16px"}>
                    <ProfileItem property={patient.resume} label="Résumé" path="resume" />
                </Box>
            </Box>
        </Modal>
    );
};

export default PatientProfile;
