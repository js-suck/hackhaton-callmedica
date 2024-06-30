import {createContext, useContext, useEffect, useState} from "react";

type TRecord = {
    id: number;
    sequences: {
        order: number;
        text: string;
        person: string;
    }[];
    resume: string;
    createdAt: string;
    updatedAt: string;
    fileName: string;
}

type TRecords = TRecord[];

type PatientRecordsContextType = {
    patientRecords: TRecords;
    setPatientRecords: React.Dispatch<React.SetStateAction<TRecords>>;
    isRecordsModalOpen: boolean;
    setIsRecordsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PatientRecordsData = createContext<PatientRecordsContextType | undefined>(undefined);

const fetchPatientRecords = async (userId: string) => {
    try {
        const response = await fetch("http://localhost:3002/api/user/" + userId + "/records");
        return await response.json();
    } catch (error) {
        console.error('Error fetching patient records:', error);
    }

}
export const PatientRecordsDataProvider: React.FC = ({children}) => {
    const [patientRecords, setPatientRecords] = useState<TRecords>([]);
    const [isRecordsModalOpen, setIsRecordsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const userId = "1";

   useEffect(() => {
        fetchPatientRecords(userId).then((data) => {
           setPatientRecords(data);
        });
    }, [])


    return (
        <PatientRecordsData.Provider value={{
            patientRecords,
            setPatientRecords,
            isRecordsModalOpen,
            setIsRecordsModalOpen,
            isLoading,
            setIsLoading
        }}>
            {children}
        </PatientRecordsData.Provider>
    )
}

export const usePatientRecordsData = () => {
    const context = useContext(PatientRecordsData);
    if (!context) {
        throw new Error('usePatientRecordsData must be used within a PatientRecordsDataProvider');
    }
    return context;
}

export default PatientRecordsData;