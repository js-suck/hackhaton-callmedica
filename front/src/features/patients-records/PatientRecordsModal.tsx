import React from 'react';
import {useDropzone} from 'react-dropzone';
import {usePatientRecordsData} from "./hooks/usePatientRecords";
import {Container, Modal, Typography, Box, CircularProgress} from "@mui/material";
import RecordsAccordion from "./components/RecordAccordion";

export const PatientRecordsModal = () => {
    const {isRecordsModalOpen, setIsRecordsModalOpen, setPatientRecords, isLoading, setIsLoading } = usePatientRecordsData();


    const onDrop = async (acceptedFiles) => {
        setIsLoading(true);

        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:3002/api/user/1/speech', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }
            const data = await response.json();
            setIsLoading(false);

            console.log('File uploaded successfully:', data);
            setPatientRecords(prevRecords => [...prevRecords, data]);
        } catch (error) {
            console.error('Error uploading file:', error);
            setIsLoading(false);
        }
    };

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    return (
        <Modal
            open={isRecordsModalOpen}
            onClose={() => setIsRecordsModalOpen(false)}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Container sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 800,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 4,
            }}>
                <Typography variant="h4" align="center" sx={{mb: 2}}>Patient Records</Typography>

                <Box {...getRootProps()} sx={{
                    border: '2px dashed gray',
                    borderRadius: 4,
                    padding: 2,
                    textAlign: 'center',
                    mb: 2,
                    backgroundColor: isDragActive ? 'lightgreen' : 'white'
                }}>
                    <input {...getInputProps()} />
                    {
                        isLoading ? ( <CircularProgress /> ) :


                        isDragActive ? (
                        <Typography>Drop the file here...</Typography>
                    ) : (
                        <Typography>Drag 'n' drop a file here, or click to select a file</Typography>
                    )}
                </Box>
                <RecordsAccordion />
            </Container>
        </Modal>
    );
};
