import {
  Box,
  Container,
  Fab,
  TextField,
  Typography,
  Paper,
  IconButton,
  Button, 
} from "@mui/material";
import React, { useState } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      const userMessage = { sender: "user", text: message };
      setChatHistory([...chatHistory, userMessage]);

      try {
        const response = await fetch("/api/chatbot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        });
        const data = await response.json();
        const botMessage = { sender: "bot", text: data.reply };
        setChatHistory([...chatHistory, userMessage, botMessage]);
        setMessage("");
      } catch (error) {
        console.error("Error sending message to chatbot API", error);
      }
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleClickOpen}
      >
        <ChatIcon />
      </Fab>
      {open && (
        <Box
          sx={{
            position: "fixed",
            bottom: "3rem",
            right: "3rem",
            width: "100%",
            maxWidth: 400,
            height: "80%",
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "background.paper",
          }}
          component={Paper}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 1,
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
              backgroundColor: "primary.main",
            }}
          >
            <Typography variant="h6" color="white" >Chat</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon/>
            </IconButton>
          </Box>
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
            }}
          >
            {chatHistory.map((chat, index) => (
              <Box
                key={index}
                sx={{
                  mb: 1,
                  p: 1,
                  borderRadius: 1,
                  backgroundColor:
                    chat.sender === "user" ? "grey.200" : "grey.400",
                  alignSelf: chat.sender === "user" ? "flex-end" : "flex-start",
                  color: chat.sender === "user" ? "black" : "white",
                  textAlign: chat.sender === "user" ? "right" : "left",
                }}
              >
                <Typography variant="body2">{chat.text}</Typography>
                {chat.sender === "user" && (
                  <Typography variant="caption" display="block">
                    You
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              label="Your Message"
              variant="outlined"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              sx={{ mr: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Chat;
