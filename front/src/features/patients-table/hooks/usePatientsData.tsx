import {createContext, useContext, useEffect, useState} from "react";
import { setPropertyByPath } from "./../../../helpers/json.js";


const PatientDataContext = createContext();


const fetchPatientData = async (id) => {
    try {
        const response = await fetch(`http://localhost:3002/api/user/${id}/user-report`);
        const data = await response.json();
        console.log("Data fetched:", data);
        return data;
    } catch (error) {
        console.error("Error fetching patients data:", error);
        return [];
    }

}


const fetchPatientsData = async () => {
    try {
        const response = await fetch("http://localhost:3002/api/user");
        const data = await response.json();
        console.log("Data fetched:", data);
        return data;
    } catch (error) {
        console.error("Error fetching patients data:", error);
        return [];
    }

}


const updatePatientData = async (id, data) => {
    try {
        const response = await fetch(`http://localhost:3002/api/user/${id}/user-report`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const updatedData = await response.json();
        console.log("Data updated:", updatedData);
        return updatedData;
    } catch (error) {
        console.error("Error updating patient data:", error);
        return null;
    }

}

const mapPatientData = (data) => {
    console.log("Mapping patient data:", data);
        return {
            id: data.userInfo.id,
            ...data
        }
}


const mapPatientDataToTableData = (data) => {
    console.log("Mapping patient data:", data);
    return {
        id: data.userInfo.id,
        lastname: data.userInfo.lastname,
        firstname: data.userInfo.firstname,
        email: data.userInfo.email
    }
}
export const PatientDataProvider = ({ children }) => {
    const [patientsData, setPatientsData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);


    useEffect( ()   => {
        const fetchData = async () => {
            const data = await fetchPatientsData();
            setPatientsData(data);
            console.log("Patients data ici:", patientsData);
            await fetchAndSetPatientData(data?.[0]);

        };

        // fetch the first user data

          fetchData();

    }, []);

    const fetchAndSetPatientData = async (patient) => {
        console.log("Fetching patient data for:", patient);
        const patientData = await fetchPatientData(patient.userInfo.id.value);
        console.log("Patient data:", patientData, "test", patientData[0]);
        setSelectedPatient(patientData);
        setPatientData(patient.userInfo.id.value, patientData);
    }


    const handleOpen = async (patient) => {
        console.log("Opening modal for patient:", patient);
        await fetchAndSetPatientData(patient);
        setIsModalOpen(true);
    };

    const selectPatient = (patient) => {
        console.log("Selected patient:", patient);
        setSelectedPatient(patient);
    }

    const handleClose = async () => {
        setIsModalOpen(false);
        const data = await fetchPatientsData();
        console.log("Fetched data:", data)
        setPatientsData(data);
    };

    const setPatientData = (id, data) => {
        console.log("Setting patient data:", data);
        setPatientsData(prevData => {
            const updatedPatients = [...prevData];
            const patientIndex = updatedPatients.findIndex(patient => patient.userInfo.id.value === id);
            if (patientIndex !== -1) {
                updatedPatients[patientIndex] = data;
            }
            console.log("Updated patients data:", updatedPatients);
            return updatedPatients;
        });
    }

    const setInfoProperty = (id, path, value, infoId) => {
        console.log("Setting property", path, "to", value, patientsData);
        setPatientsData(prevData => {
            const updatedPatients = [...prevData];
            console.log("Updated patients:", updatedPatients, "ID:", id);
            const patientIndex = updatedPatients.findIndex(patient => patient?.userInfo?.id.value === id);
            console.log("Patient index:", patientIndex);
            if (patientIndex !== -1) {
                updatedPatients[patientIndex] = setPropertyByPath({ ...updatedPatients[patientIndex] }, path, value)
            }
            return updatedPatients;
        });

        savePatientData(id, patientsData.find(patient => patient?.userInfo?.id.value === id));

        console.log("Updated patients data:", patientsData);
    };

    const setIsEditingMode = (value) => {
        setIsEditing(value);
    };


    const savePatientData = async (id, data) =>  updatePatientData(id, data);


    return (
        <PatientDataContext.Provider value={{ patientsData, setPatientsData, setInfoProperty, isEditing, setIsEditingMode, isModalOpen, handleOpen, handleClose, selectedPatient, selectPatient }}>
            {children}
        </PatientDataContext.Provider>
    );
}

export const usePatientsData = () => useContext(PatientDataContext);
