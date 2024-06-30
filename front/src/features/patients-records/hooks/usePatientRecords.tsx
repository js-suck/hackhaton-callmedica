import {createContext, useContext, useEffect, useState} from "react";

type TRecord = {
    id: number;
    sequences: {
        order: number;
        text: string;
        person: string;
    }[];
    resume: string;
}

type TRecords = TRecord[];

type PatientRecordsContextType = {
    patientRecords: TRecords;
    setPatientRecords: React.Dispatch<React.SetStateAction<TRecords>>;
    isRecordsModalOpen: boolean;
    setIsRecordsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const mockPatientRecords = [
    {
        id: 1,
        sequences: [
            { order: 1, text: "allô", person: "Unknown" },
            { order: 2, text: "oui bonjour c'est la clinique Jules Verne", person: "Unknown" },
            { order: 3, text: "oui bonjour", person: "Unknown" },
            { order: 4, text: "j'appelle pour savoir si tout va bien", person: "Unknown" },
            { order: 5, text: "oui ça va", person: "Unknown" },
            { order: 6, text: "pas de douleur, pas de fièvre?", person: "Unknown" },
            { order: 7, text: "je n'ai pas pris ma température, mais je pense que je le sentirais si j'avais de la fièvre", person: "Unknown" },
            { order: 8, text: "d'accord", person: "Unknown" },
            { order: 9, text: "je peux pas parler mettre euh j'ai vous m'avez donné j'ai eu une ordonnance pour mettre de la glace vous savez de comment je sais pas c'est pas vraiment de la glace je le mets au congélateur et puis je le remets pendant 20 minutes sur ma main comme ce que vous m'avez fait après l'opération et donc et ça il y a double alors il y a le la glace et puis il y a une une attelle qui emporte la la glace je me suis mis la alors bon je le fais 20 minutes et après j'ai mis la telle pour mettre mon", person: "Unknown" },
            { order: 10, text: "pour mettre ma main dans le collier", person: "Unknown" },
            { order: 11, text: "oui", person: "Unknown" },
            { order: 12, text: "est-ce qu'il faut ou est-ce qu'il faut pas", person: "Unknown" },
            { order: 13, text: "bah si c'est bon", person: "Unknown" },
            { order: 14, text: "oui", person: "Unknown" },
            { order: 15, text: "d'accord", person: "Unknown" },
            { order: 16, text: "c'est bon parce que bon bah ça me tire l'épaule et puis ça me fait très très mal dans le dans le dos le fait de tenir la main en l'air alors ça vraiment j'ai une consolidation je me sens bien et je peux pas dire que je j'ai vraiment des douleurs vous voyez ce midi j'ai un cachet à prendre de toutes les 6h ou à midi j'ai pas pris d'habitude je prends du Dafalgan j'en ai pas pris et j'ai pas de bon ben j'ai une gêne mais j'ai pas de douleur à dire ça j'aime par contre ce que j'ai c'est ben je sais pas si ça peut je vais je m'étais rendu compte que j'avais un problème parce que j'avais des des fourmis ou de la de l'électricité ou de la gelée dans les doigts je l'ai encore ça", person: "Unknown" },
            { order: 17, text: "d'accord", person: "Unknown" },
            { order: 18, text: "c'est peut-être normal", person: "Unknown" },
            { order: 19, text: "mais après il faudra en discuter avec le chirurgien moi je saurais pas vous renseigner à ce niveau-là", person: "Unknown" },
            { order: 20, text: "on est d'accord mais non mais c'est ça ça vient ça repart je c'est pas c'est pas vraiment vraiment gênant quoi", person: "Unknown" },
            { order: 21, text: "d'accord", person: "Unknown" },
            { order: 22, text: "autrement non je peux pas je peux pas me plaindre par contre quand je suis je me suis couché à 10h d'habitude je dors jamais avant 2h du matin là je me suis assouplie tout de suite à 6h j'étais réveillé j'ai jamais passé une nuit comme ça depuis je sais pas quand", person: "Unknown" },
            { order: 23, text: "bah c'est bien", person: "Unknown" },
            { order: 24, text: "j'ai récupéré", person: "Unknown" },
            { order: 25, text: "mais c'est très bien", person: "Unknown" },
            { order: 26, text: "voilà merci beaucoup madame", person: "Unknown" },
            { order: 27, text: "bonne journée madame", person: "Unknown" },
            { order: 28, text: "bonne journée", person: "Unknown" },
            { order: 29, text: "au revoir", person: "Unknown" }
        ],
        resume: "Patient complained of various symptoms, discussed treatment options, and planned follow-up."
    },
    {
        id: 2,
        sequences: [
            { order: 1, text: "allô", person: "Unknown" },
            { order: 2, text: "oui bonjour c'est la clinique Jules Verne", person: "Unknown" },
            { order: 3, text: "oui bonjour", person: "Unknown" },
            { order: 4, text: "j'appelle pour savoir si tout va bien", person: "Unknown" },
            { order: 5, text: "oui ça va", person: "Unknown" },
            { order: 6, text: "pas de douleur, pas de fièvre?", person: "Unknown" },
            { order: 7, text: "je n'ai pas pris ma température, mais je pense que je le sentirais si j'avais de la fièvre", person: "Unknown" },
            { order: 8, text: "d'accord", person: "Unknown" },
            { order: 9, text: "je peux pas parler mettre euh j'ai vous m'avez donné j'ai eu une ordonnance pour mettre de la glace vous savez de comment je sais pas c'est pas vraiment de la glace je le mets au congélateur et puis je le remets pendant 20 minutes sur ma main comme ce que vous m'avez fait après l'opération et donc et ça il y a double alors il y a le la glace et puis il y a une une attelle qui emporte la la glace je me suis mis la alors bon je le fais 20 minutes et après j'ai mis la telle pour mettre mon", person: "Unknown" },
            { order: 10, text: "pour mettre ma main dans le collier", person: "Unknown" },
            { order: 11, text: "oui", person: "Unknown" },
            { order: 12, text: "est-ce qu'il faut ou est-ce qu'il faut pas", person: "Unknown" },
            { order: 13, text: "bah si c'est bon", person: "Unknown" },
            { order: 14, text: "oui", person: "Unknown" },
            { order: 15, text: "d'accord", person: "Unknown" },
            { order: 16, text: "c'est bon parce que bon bah ça me tire l'épaule et puis ça me fait très très mal dans le dans le dos le fait de tenir la main en l'air alors ça vraiment j'ai une consolidation je me sens bien et je peux pas dire que je j'ai vraiment des douleurs vous voyez ce midi j'ai un cachet à prendre de toutes les 6h ou à midi j'ai pas pris d'habitude je prends du Dafalgan j'en ai pas pris et j'ai pas de bon ben j'ai une gêne mais j'ai pas de douleur à dire ça j'aime par contre ce que j'ai c'est ben je sais pas si ça peut je vais je m'étais rendu compte que j'avais un problème parce que j'avais des des fourmis ou de la de l'électricité ou de la gelée dans les doigts je l'ai encore ça", person: "Unknown" },
            { order: 17, text: "d'accord", person: "Unknown" },
            { order: 18, text: "c'est peut-être normal", person: "Unknown" },
            { order: 19, text: "mais après il faudra en discuter avec le chirurgien moi je saurais pas vous renseigner à ce niveau-là", person: "Unknown" },
            { order: 20, text: "on est d'accord mais non mais c'est ça ça vient ça repart je c'est pas c'est pas vraiment vraiment gênant quoi", person: "Unknown" },
            { order: 21, text: "d'accord", person: "Unknown" },
            { order: 22, text: "autrement non je peux pas je peux pas me plaindre par contre quand je suis je me suis couché à 10h d'habitude je dors jamais avant 2h du matin là je me suis assouplie tout de suite à 6h j'étais réveillé j'ai jamais passé une nuit comme ça depuis je sais pas quand", person: "Unknown" },
            { order: 23, text: "bah c'est bien", person: "Unknown" },
            { order: 24, text: "j'ai récupéré", person: "Unknown" },
            { order: 25, text: "mais c'est très bien", person: "Unknown" },
            { order: 26, text: "voilà merci beaucoup madame", person: "Unknown" },
            { order: 27, text: "bonne journée madame", person: "Unknown" },
            { order: 28, text: "bonne journée", person: "Unknown" },
            { order: 29, text: "au revoir", person: "Unknown" }
        ],
        resume: "Patient complained of various symptoms, discussed treatment options, and planned follow-up."
    },
    {
        id: 3,
        sequences: [
            { order: 1, text: "Patient reports feeling anxious", person: "Dr. Brown" },
            { order: 2, text: "Discussed coping strategies", person: "Dr. Brown" },
            { order: 3, text: "Referred to a psychologist", person: "Dr. Brown" }
        ],
        resume: "Patient reported anxiety. Coping strategies were discussed. Referred to a psychologist for further evaluation."
    },
    {
        id: 4,
        sequences: [
            { order: 1, text: "Annual physical exam", person: "Dr. Lee" },
            { order: 2, text: "All vital signs normal", person: "Dr. Lee" },
            { order: 3, text: "Recommended flu vaccination", person: "Dr. Lee" }
        ],
        resume: "Annual physical exam completed with normal vital signs. Flu vaccination was recommended."
    },
    {
        id: 5,
        sequences: [
            { order: 1, text: "Patient complains of back pain", person: "Dr. White" },
            { order: 2, text: "Prescribed physical therapy", person: "Dr. White" },
            { order: 3, text: "Follow-up in two weeks", person: "Dr. White" }
        ],
        resume: "Patient complained of back pain. Physical therapy was prescribed. Follow-up scheduled in two weeks."
    }
];


const PatientRecordsData = createContext<PatientRecordsContextType | undefined>(undefined);

const fetchPatientRecords = async (userId: string) => {
    try {
        const response = await fetch("http://localhost:3002/api/user/" + userId + "/records");
        const data = await response.json();
        return data;
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