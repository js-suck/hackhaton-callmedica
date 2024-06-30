import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import {Box, useTheme} from "@mui/material";
import { usePatientRecordsData } from "../hooks/usePatientRecords";
import AudioPlayer from "./AudioPlayer";
import audio from "./../audio/audio2.wav";

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme, expanded }) => ({
    border: expanded ? `1px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
    borderRadius: "8px",
    backgroundColor: expanded ? theme.palette.action.hover : 'transparent',
    '&::before': {
        display: 'none',
    },
    "&:hover": {
        backgroundColor: theme.palette.action.hover,
    },
    marginBottom: theme.spacing(2),
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    fontWeight: theme.typography.fontWeightMedium,
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
    maxHeight: '800px',
    overflowY: 'auto'
}));

export default function RecordsAccordion() {
    const [expanded, setExpanded] = useState(false);
    const { patientRecords } = usePatientRecordsData();
    const [currentTranscriptIndex, setCurrentTranscriptIndex] = useState(null);
    const theme = useTheme();

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
        setCurrentTranscriptIndex(null);
    };

    const handleTranscriptClick = (index) => {
        setCurrentTranscriptIndex(index);
    };

    return (
        <Box>
            {patientRecords.map((record) => (
                <Accordion
                    key={record.id}
                    expanded={expanded === `panel${record.id}`}
                    onChange={handleChange(`panel${record.id}`)}
                >
                    <AccordionSummary aria-controls={`panel${record.id}d-content`} id={`panel${record.id}d-header`}>
                        <Typography fontWeight="bold">  Enregistrement du {new Date(record?.createdAt).toLocaleString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <AudioPlayer audioUrl={"http://localhost:3002/files/" + record.fileName} />
                        <Box sx={{ mt: 2, mb: 2, border: `1px solid ${theme.palette.primary.main}` , bgcolor: 'background.paper', borderRadius: 4, p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Résumé
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom sx={{ marginBottom: '20px'}}>
                                {record.text.resume}
                            </Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ marginBottom: '10px'}}>
                                Transcription
                            </Typography>

                        {record.text?.sequences?.map((sequence, seqIndex) => (
                            <Box
                                key={seqIndex}
                                mb={1}
                                onClick={() => handleTranscriptClick(seqIndex)}
                                sx={{
                                    backgroundColor: currentTranscriptIndex === seqIndex ? '#FFECB3' : 'transparent',  // Orange light color
                                    cursor: 'pointer',
                                    borderRadius: 4,
                                    padding: 1,
                                    borderBottom: `1px solid ${theme.palette.divider}`
                                }}
                            >
                                <Typography variant="body2" color="textSecondary">
                                    Speaker: {sequence.person}
                                </Typography>
                                <Typography variant="body1">
                                    {sequence.text}
                                </Typography>
                            </Box>
                        ))}
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
}
