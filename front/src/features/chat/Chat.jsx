import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Fab,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import ChatIcon from "@mui/icons-material/Chat.js";

export const Chat = () => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return <>
        <Container sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            padding: 0,
            margin: 0,
        }}>

            <Fab color="primary" aria-label="chat" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={handleClickOpen}>
                <ChatIcon />
            </Fab>
        </Container>
        <Dialog open={open} onClose={handleClose} aria-labelledby="chat-dialog-title">
            <DialogTitle id="chat-dialog-title">Chat</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    This is a chat window. You can add your chat interface here.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    </>
}