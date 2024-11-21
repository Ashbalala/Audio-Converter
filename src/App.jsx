import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from "@mui/material";

function App() {
  const [tracks, setTracks] = useState([]);
  const [sharedImage, setSharedImage] = useState("");
  const [useSharedImage, setUseSharedImage] = useState(true);
  const [autoIncrementVolume, setAutoIncrementVolume] = useState(false);
  const [chapter, setChapter] = useState("");
  const [audioLink, setAudioLink] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [javaScriptContent, setJavaScriptContent] = useState("");

  // Default track details
  const defaultTrack = {
    chapter: "Intro",
    audio: "https://od.lk/s/NTJfNDczNTA5NDBf/cover.mp3",
    image: "https://od.lk/s/NTJfNDczNTA5NDFf/sample.jpg",
  };

  React.useEffect(() => {
    fetch("/src/java.html")
      .then((response) => response.text())
      .then((data) => {
        setJavaScriptContent(data);
      })
      .catch((error) => console.error("Error loading JavaScript:", error));
  }, []);

  const addTrack = () => {
    if (audioLink) {
      const newChapter = autoIncrementVolume
        ? `Volume ${tracks.length + 1}`
        : chapter;

      setTracks([
        ...tracks,
        {
          chapter: newChapter,
          audio: audioLink,
          image: useSharedImage ? sharedImage : imageLink,
        },
      ]);
      setChapter("");
      setAudioLink("");
      setImageLink("");
    } else {
      alert("Please provide an audio link.");
    }
  };

  const generateCode = () => {
    return `
  <div class="audio-player-container" style="font-family: 'Roboto', sans-serif; max-width: 400px; margin: 0 auto; background: #f8f9fa; border-radius: 20px; padding: 20px; box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);">
      <div id="cover" style="width: 180px; height: 180px; background-image: url('${defaultTrack.image}'); background-size: cover; background-position: center; border-radius: 15px; margin: 0 auto; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);"></div>
      <div style="text-align: center; margin-top: 10px; margin-bottom: 20px;">
          <p id="track-title" style="font-size: 14px; color: #555;">${defaultTrack.chapter}</p>
      </div>
      <audio id="audio" src="${defaultTrack.audio}"></audio>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
          <span id="current-time" style="font-size: 12px; color: #555;">0:00</span>
          <div id="progress-bar" style="flex: 1; height: 6px; background: #e0e0e0; border-radius: 3px; margin: 0 10px; position: relative; cursor: pointer;">
              <div id="progress" style="width: 0; height: 100%; background: #5aa897; border-radius: 3px; transition: width 0.3s;"></div>
          </div>
          <span id="duration-time" style="font-size: 12px; color: #555;">0:00</span>
      </div>
      <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 20px;">
          <button id="backward" style="background: #ffffff; color: #5aa897; border: 2px solid #5aa897; padding: 10px; border-radius: 50%; font-size: 16px; cursor: pointer; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">
              <i class="bx bx-rotate-left"></i>
          </button>
          <button id="play" style="background: #5aa897; color: #ffffff; border: none; padding: 10px; border-radius: 50%; font-size: 18px; cursor: pointer; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">
              <i class="bx bx-play"></i>
          </button>
          <button id="forward" style="background: #ffffff; color: #5aa897; border: 2px solid #5aa897; padding: 10px; border-radius: 50%; font-size: 16px; cursor: pointer; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">
              <i class="bx bx-rotate-right"></i>
          </button>
      </div>
      <div style="display: flex; justify-content: center; margin-bottom: 20px;">
          <select id="speed" style="background: #ffffff; color: #5aa897; border: 2px solid #5aa897; border-radius: 10px; padding: 8px; font-size: 14px; cursor: pointer; width: 80px; text-align: center;">
              <option value="0.75">0.75x</option>
              <option value="1" selected>1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
          </select>
      </div>
      <div id="playlist-info" style="text-align: center; margin-bottom: 10px; font-size: 14px; color: #555; font-weight: bold;">
          Playlist: <span id="playlist-count">${tracks.length}</span>
      </div>
      <div id="playlist" style="background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 10px; overflow-y: auto; max-height: 200px; padding: 10px;">
          ${tracks
            .map(
              (track) => `
          <div class="track" data-title="${track.chapter}" data-cover="${
                track.image
              }" data-audio="${track.audio}" style="padding: 12px; cursor: pointer; color: #5aa897; font-size: 14px; border-bottom: 1px solid #e0e0e0;">
              ${track.chapter}
          </div>`
            )
            .join("")}
      </div>
      <link href="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
  </div>`;
  };  

  const generateCodeWithJavaScript = () => {
    return `${generateCode()}\n${javaScriptContent}`;
  };
  
  const copyToClipboard = () => {
    const finalOutput = generateCodeWithJavaScript();
    navigator.clipboard.writeText(finalOutput).catch((err) => {
      console.error("Error copying text to clipboard: ", err);
    });
  };
  
  const openConverter = () => {
    window.open(`${window.location.origin}/converter`, "_blank");
  };
  
  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <Paper sx={{ p: 4, mt: 4, width: "100%" }} elevation={4}>
        <FormControlLabel
          control={
            <Checkbox
              checked={useSharedImage}
              onChange={(e) => setUseSharedImage(e.target.checked)}
            />
          }
          label="Use shared image for all tracks"
        />
        {useSharedImage && (
          <TextField
            fullWidth
            label="Shared Image URL"
            value={sharedImage}
            onChange={(e) => setSharedImage(e.target.value)}
            sx={{ mb: 2 }}
          />
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={autoIncrementVolume}
              onChange={(e) => setAutoIncrementVolume(e.target.checked)}
            />
          }
          label="Auto-Increment Volume (e.g., Volume 1, Volume 2)"
        />
        {!autoIncrementVolume && (
          <TextField
            fullWidth
            label="Chapter"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            sx={{ mb: 2 }}
          />
        )}
        <TextField
          fullWidth
          label="Audio Link"
          value={audioLink}
          onChange={(e) => setAudioLink(e.target.value)}
          sx={{ mb: 2 }}
        />
        {!useSharedImage && (
          <TextField
            fullWidth
            label="Image Link"
            value={imageLink}
            onChange={(e) => setImageLink(e.target.value)}
            sx={{ mb: 2 }}
          />
        )}
        <Button
          fullWidth
          variant="contained"
          onClick={addTrack}
          sx={{ mb: 2 }}
        >
          Add Track
        </Button>
        <Box
          sx={{
            maxHeight: "200px",
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: "5px",
            p: 2,
          }}
        >
          <List>
            {tracks.map((track, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={track.image} alt={`Track ${index + 1}`} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`Track ${index + 1}: ${track.chapter}`}
                    secondary={`Audio: ${track.audio} | Image: ${track.image}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Paper>
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        onClick={copyToClipboard}
        sx={{ mt: 2 }}
      >
        Copy and Add JavaScript
      </Button>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={openConverter}
        sx={{ mt: 2 }}
      >
        Open Converter
      </Button>
    </Container>
  );  
}

export default App;