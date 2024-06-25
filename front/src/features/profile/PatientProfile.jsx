import React from 'react';
import PropTypes from 'prop-types';
import { Container, Typography, List, ListItem, ListItemText, Chip } from '@mui/material';

export const PatientProfile = ({ data }) => {
    const renderSource = (source) => {
        const color = source === "AI" ? "primary" : "secondary";
        return <Chip label={source} color={color} size="small" />;
    };

    return (
        <Container>
            <Typography variant="h1">Patient Profile</Typography>
            <Typography variant="h2">User Information</Typography>
            <List>
                <ListItem>
                    <ListItemText
                        primary="First Name"
                        secondary={
                            <>
                                {data.userInfo.firstName.value} {renderSource(data.userInfo.firstName.source)}
                            </>
                        }
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Last Name"
                        secondary={
                            <>
                                {data.userInfo.lastName.value} {renderSource(data.userInfo.lastName.source)}
                            </>
                        }
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Email"
                        secondary={
                            <>
                                {data.userInfo.email.value} {renderSource(data.userInfo.email.source)}
                            </>
                        }
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Location"
                        secondary={
                            <>
                                {data.userInfo.location.value} {renderSource(data.userInfo.location.source)}
                            </>
                        }
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Birth Date"
                        secondary={
                            <>
                                {data.userInfo.birthDate.value} {renderSource(data.userInfo.birthDate.source)}
                            </>
                        }
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Current Address"
                        secondary={
                            <>
                                {data.userInfo.currentAddress.value} {renderSource(data.userInfo.currentAddress.source)}
                            </>
                        }
                    />
                </ListItem>
            </List>
            <Typography variant="h2">Possible Diseases</Typography>
            <List>
                {data.possibleDiseases.map((disease, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={disease.value}
                            secondary={renderSource(disease.source)}
                        />
                    </ListItem>
                ))}
            </List>
            <Typography variant="h2">Discovered Disease</Typography>
            <Typography variant="body1">
                {data.discoveredDisease.value} {renderSource(data.discoveredDisease.source)}
            </Typography>
            <Typography variant="h2">Medical History</Typography>
            <List>
                {data.medicalHistory.map((history, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={history.value}
                            secondary={renderSource(history.source)}
                        />
                    </ListItem>
                ))}
            </List>
            <Typography variant="h2">Current Treatment</Typography>
            <List>
                {data.currentTreatment.map((treatment, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={`${treatment.name} - ${treatment.dosage} - ${treatment.frequency}`}
                            secondary={renderSource(treatment.source)}
                        />
                    </ListItem>
                ))}
            </List>
            <Typography variant="h2">Remarks</Typography>
            <Typography variant="body1">
                {data.remarks.value} {renderSource(data.remarks.source)}
            </Typography>
        </Container>
    );
};

PatientProfile.propTypes = {
    data: PropTypes.shape({
        userInfo: PropTypes.shape({
            firstName: PropTypes.shape({
                value: PropTypes.string.isRequired,
                source: PropTypes.oneOf(['practitioner', 'AI']).isRequired,
            }).isRequired,
            lastName: PropTypes.shape({
                value: PropTypes.string.isRequired,
                source: PropTypes.oneOf(['practitioner', 'AI']).isRequired,
            }).isRequired,
            email: PropTypes.shape({
                value: PropTypes.string.isRequired,
                source: PropTypes.oneOf(['practitioner', 'AI']).isRequired,
            }).isRequired,
            location: PropTypes.shape({
                value: PropTypes.string.isRequired,
                source: PropTypes.oneOf(['practitioner', 'AI']).isRequired,
            }).isRequired,
            birthDate: PropTypes.shape({
                value: PropTypes.string.isRequired,
                source: PropTypes.oneOf(['practitioner', 'AI']).isRequired,
            }).isRequired,
            currentAddress: PropTypes.shape({
                value: PropTypes.string.isRequired,
                source: PropTypes.oneOf(['practitioner', 'AI']).isRequired,
            }).isRequired,
        }).isRequired,
        possibleDiseases: PropTypes.arrayOf(
            PropTypes.shape({
                value: PropTypes.string.isRequired,
                source: PropTypes.oneOf(['practitioner', 'AI']).isRequired,
            })
        ).isRequired,
        discoveredDisease: PropTypes.shape({
            value: PropTypes.string.isRequired,
            source: PropTypes.oneOf(['practitioner', 'AI']).isRequired,
        }).isRequired,
        medicalHistory: PropTypes.arrayOf(
            PropTypes.shape({
                value: PropTypes.string.isRequired,
                source: PropTypes.oneOf(['practitioner', 'AI']).isRequired,
            })
        ).isRequired,
        currentTreatment: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                dosage: PropTypes.string.isRequired,
                frequency: PropTypes.string.isRequired,
                source: PropTypes.oneOf(['practitioner', 'AI']).isRequired,
            })
        ).isRequired,
        remarks: PropTypes.shape({
            value: PropTypes.string.isRequired,
            source: PropTypes.oneOf(['practitioner', 'AI']).isRequired,
        }).isRequired,
    }).isRequired,
};

export default PatientProfile;
