import * as React from "react";
import { Chip, Input, ListItem, ListItemText, IconButton } from "@mui/material";
import { Check, Edit } from "@mui/icons-material";
import { usePatientsData } from "../patients-table/hooks/usePatientsData";

type ProfileItemProps = {
    property: {
        value: string;
        source: string;
    };
    label: string;
    path: string;
}

export const ProfileItem: React.FC<ProfileItemProps> = ({ property, label, path }) => {
    const [editMode, setEditMode] = React.useState(false);
    const { selectedPatient, setInfoProperty } = usePatientsData();
    const [editProperty, setEditProperty] = React.useState(property);

    const handleEdit = () => {
        setEditMode(!editMode);
    };

    const onChange = (value: string) => {
        setEditProperty({
            ...editProperty,
            value
        });
    };

    const onSave = (value: string) => {
        if (selectedPatient) {
            console.log(selectedPatient.id, path, value);
            setInfoProperty(selectedPatient.userInfo.id.value, path, value)
        }
        setEditMode(false);
    };

    const renderSource = (isGeneratedByAI: boolean) => {
        const color = isGeneratedByAI ? "primary" : "secondary";
        const source = isGeneratedByAI ? "AI" : "Praticien";
        return <Chip label={source} color={color} size="small" variant="outlined" />;
    };

    if (editMode) {
        return (
            <EditItem
                property={editProperty}
                label={label}
                onChange={onChange}
                onSave={onSave}
                setEditMode={setEditMode}
                setEditInfo={setEditProperty}
            />
        );
    }

    return (
        <ListItem>
            <ListItemText
                primary={<>
                    {editProperty?.value}
                    <IconButton size="small" onClick={handleEdit}><Edit fontSize="small" /></IconButton>
                    {renderSource(property?.generatedByAI)}
                </>}

            />
        </ListItem>
    );
};

const EditItem: React.FC<ProfileItemProps & { setEditMode: (value: boolean) => void, setEditInfo: (property: { value: string, source: string }) => void }> = ({ property, label, onChange, onSave, setEditMode, setEditInfo }) => {
    const listItemRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (listItemRef.current && !listItemRef.current.contains(event.target as Node)) {
                setEditMode(false);
                setEditInfo(property);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [property, setEditMode, setEditInfo]);

    return (
        <ListItem ref={listItemRef}>
            <ListItemText
                primary={label}
                secondary={
                    <>
                        <Input
                            value={property.value}
                            onChange={(e) => onChange(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    onSave(property);
                                }
                            }}
                            fullWidth
                        />
                    </>
                }
            />
            <IconButton size="small" onClick={() => onSave(property.value)}><Check fontSize="small" /></IconButton>
        </ListItem>
    );
};
