import {createContext, Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import { setPropertyByPath } from "./../../../helpers/json.js";



export type TProperty = {
    value: string;
    generatedByAI?: boolean;
}

interface TPatientData {
    userInfo: {
        id: TProperty;
        lastname: TProperty;
        firstname: TProperty;
        email: TProperty;
        location: TProperty;
        birthDate: TProperty;
        currentAddress: TProperty;
    };
    possibleDiseases: TProperty[];
    discoveredDisease: TProperty[];
    medicalHistory: TProperty[];
    currentTreatment: TProperty[];
    remark: TProperty;
    resume: TProperty;
}

interface PatientDataContextValue {
    patientsData: TPatientData[];
    setPatientsData: Dispatch<SetStateAction<TPatientData[]>>;
    setInfoProperty: (id: string, path: string, value: any) => void;
    isEditing: boolean;
    setIsEditingMode: Dispatch<SetStateAction<boolean>>;
    isModalOpen: boolean;
    handleOpen: (patient: TPatientData) => Promise<void>;
    handleClose: () => Promise<void>;
    selectedPatient: TPatientData | null;
    selectPatient: (patient: TPatientData) => void;
}

const PatientDataContext = createContext();


const fetchPatientData = async (id: string): Promise<TPatientData> => {
    try {
        const response = await fetch(`http://localhost:3002/api/user/${id}/user-report`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching patients data:", error);
        return [];
    }

}


const fetchPatientsData = async (): Promise<TPatientData[]> => {
    try {
        const response = await fetch("http://localhost:3002/api/user");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching patients data:", error);
        return [];
    }

}


const updatePatientData = async (id: string, data: TPatientData): Promise<TPatientData | null> => {
    try {
        const response = await fetch(`http://localhost:3002/api/user/${id}/user-report`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const updatedData = await response.json();
        return updatedData;
    } catch (error) {
        console.error("Error updating patient data:", error);
        return null;
    }

}

export const PatientDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [patientsData, setPatientsData] = useState<TPatientData[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);


    useEffect( ()   => {
        const fetchData = async () => {
            const data = await fetchPatientsData();
            setPatientsData(data);
            await fetchAndSetPatientData(data?.[0]);

        };

        // fetch the first user data

          fetchData();

    }, []);

    const fetchAndSetPatientData = async (patient: TPatientData) => {
        const patientData = await fetchPatientData(patient.userInfo.id.value);
        setSelectedPatient(patientData);
        setPatientData(patient.userInfo.id.value, patientData);
    }


    const handleOpen = async (patient: TPatientData) => {
        await fetchAndSetPatientData(patient);
        setIsModalOpen(true);
    };

    const selectPatient = (patient: TPatientData) => {
        setSelectedPatient(patient);
    }

    const handleClose = async () => {
        setIsModalOpen(false);
        const data = await fetchPatientsData();
        setPatientsData(data);
    };

    const setPatientData = (id: string, data: TPatientData): void => {
        setPatientsData(prevData => {
            const updatedPatients = [...prevData];
            const patientIndex = updatedPatients.findIndex(patient => patient.userInfo.id.value === id);
            if (patientIndex !== -1) {
                updatedPatients[patientIndex] = data;
            }
            return updatedPatients;
        });
    }

    const setInfoProperty = (id : string, path: string, value: any) => {
        setPatientsData(prevData => {
            const updatedPatients = [...prevData];
            const patientIndex = updatedPatients.findIndex(patient => patient?.userInfo?.id.value === id);
            if (patientIndex !== -1) {
                updatedPatients[patientIndex] = setPropertyByPath({ ...updatedPatients[patientIndex] }, path, value)
            }
            return updatedPatients;
        });

        savePatientData(id, patientsData.find(patient => patient?.userInfo?.id.value === id));

    };

    const setIsEditingMode = (value: boolean | ((prevState: boolean) => boolean)) => {
        setIsEditing(value);
    };


    const savePatientData = async (id: string, data: TPatientData) =>  updatePatientData(id, data);


    return (
        <PatientDataContext.Provider value={{ patientsData, setPatientsData, setInfoProperty, isEditing, setIsEditingMode, isModalOpen, handleOpen, handleClose, selectedPatient, selectPatient }}>
            {children}
        </PatientDataContext.Provider>
    );
}

export const usePatientsData = (): PatientDataContextValue => useContext(PatientDataContext) as PatientDataContextValue;