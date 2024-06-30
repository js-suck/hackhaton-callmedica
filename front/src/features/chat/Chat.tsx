import "regenerator-runtime/runtime";
import {
  Box,
  Fab,
  TextField,
  Typography,
  Paper,
  IconButton,
  Button,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MicIcon from "@mui/icons-material/Mic";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {usePatientsData} from "../patients-table/hooks/usePatientsData";

const preRecordedMessages = [
  "J'ai une coupure. Que dois-je faire ?",
  "J'ai de la fièvre. Quels sont les conseils ?",
  "Comment gérer une entorse ?",
  "Quels sont les symptômes de l'intoxication alimentaire ?",
  "Que faire en cas de brûlure mineure ?",
];

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const {selectedPatient} = usePatientsData();
  const userId = selectedPatient?.userInfo?.id.value || 1;

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();


  useEffect(() => {
    setOpen(!!selectedPatient);
  }, [selectedPatient]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }


  const handleClickOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSendMessage = async (messageToSend) => {
    if (messageToSend.trim() !== "") {
      const userMessage = { role: "user", content: messageToSend };
      const newChatHistory = [...chatHistory, userMessage];

      setLoading(true); // Start loading

      try {
        const response = await fetch(
          `http://localhost:3002/api/user/${userId}/ask`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ messages: newChatHistory }),
          }
        );
        const data = await response.text();
        const botMessage = { role: "assistant", content: data };
        setChatHistory([...newChatHistory, botMessage]);
        setMessage("");
        resetTranscript();
      } catch (error) {
        console.error("Error sending message to chatbot API", error);
      } finally {
        setLoading(false); // End loading
      }
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePreRecordedMessageClick = (message) => {
    handleSendMessage(message);
    handleMenuClose();
  };

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({
        continuous: false,
        language: "fr-FR",
      });
    }
  };

  const handleResetTranscript = () => {
    resetTranscript();
    setMessage("");
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
              backgroundColor: "white",
            }}
          >
            <Typography variant="h6" color="black">
              Chat with {selectedPatient?.userInfo?.firstname?.value || "Patient"}
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              backgroundColor: "grey.100",
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
                  borderRadius: 2,
                  backgroundColor: chat.role === "user" ? "#ff5722b8" : "white",
                  alignSelf: chat.role === "user" ? "flex-start" : "flex-end",
                  color: chat.role === "user" ? "white" : "black",
                  textAlign: chat.role === "user" ? "right" : "left",
                }}
              >
                <Typography variant="body2">{chat.content}</Typography>
                {chat.role === "user" && (
                  <Typography variant="caption" display="block">
                    You
                  </Typography>
                )}
                {chat.role === "assistant" && (
                  <Typography variant="caption" display="block">
                    CallMedica
                  </Typography>
                )}
              </Box>
            ))}
            {loading && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            )}
          </Box>
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <TextField
              label="Your Message"
              variant="outlined"
              fullWidth
              value={message || transcript}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(message || transcript);
                }
              }}
              sx={{ mb: 2 }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <IconButton
                aria-label="mic"
                onClick={handleMicClick}
                sx={{ mr: 2 }}
              >
                <MicIcon color={listening ? "primary" : "inherit"} />
              </IconButton>
              <IconButton
                aria-label="reset"
                onClick={handleResetTranscript}
                sx={{ mr: 2 }}
              >
                <CloseIcon />
              </IconButton>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleMenuClick}
                sx={{ mr: 2 }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {preRecordedMessages.map((msg, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => handlePreRecordedMessageClick(msg)}
                  >
                    {msg}
                  </MenuItem>
                ))}
              </Menu>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSendMessage(message || transcript)}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Chat;
