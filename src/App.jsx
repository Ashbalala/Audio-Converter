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
    const jsContent = `<script>
    const audio = document.getElementById('audio');
    const playButton = document.getElementById('play');
    const backwardButton = document.getElementById('backward');
    const forwardButton = document.getElementById('forward');
    const speedSelector = document.getElementById('speed');
    const progressBar = document.getElementById('progress-bar');
    const progress = document.getElementById('progress');
    const currentTimeDisplay = document.getElementById('current-time');
    const durationTimeDisplay = document.getElementById('duration-time');
    const playlist = document.getElementById('playlist');
    const trackTitle = document.getElementById('track-title');
    const cover = document.getElementById('cover');

    // Default "Intro" track
    const defaultTrack = {
        title: 'Intro',
        cover: 'https://od.lk/s/NTJfNDczNTA5NDFf/sample.jpg',
        audio: 'https://od.lk/s/NTJfNDczNTA5NDBf/cover.mp3',
    };

    // Fallback storage for environments where localStorage isn't available
    let fallbackStorage = {};

    // Safe wrapper for localStorage get/set
    const safeGetItem = (key) => {
        try {
            return localStorage.getItem(key);
        } catch {
            return fallbackStorage[key] || null;
        }
    };

    const safeSetItem = (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch {
            fallbackStorage[key] = value;
        }
    };

    const trackPositions = JSON.parse(safeGetItem('audioPlayerTracks')) || {};

    // Debounce function to limit the frequency of saveProgress calls
    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    // Save current progress to localStorage (debounced)
    const saveProgress = debounce(() => {
        const activeTrack = document.querySelector('.track.active');
        const currentAudio = activeTrack ? activeTrack.dataset.audio : defaultTrack.audio;

        trackPositions[currentAudio] = audio.currentTime;

        safeSetItem('audioPlayerTracks', JSON.stringify(trackPositions));
        safeSetItem(
            'audioPlayerTrack',
            JSON.stringify({
                currentTrack: currentAudio,
                currentTime: audio.currentTime,
                playbackRate: audio.playbackRate,
            })
        );
    }, 300);

    // Load saved progress and apply it
    const loadProgress = () => {
        const savedTrack = JSON.parse(safeGetItem('audioPlayerTrack'));

        if (savedTrack) {
            const { currentTrack, currentTime, playbackRate } = savedTrack;

            // If the saved track is the default track, load it without highlighting
            if (currentTrack === defaultTrack.audio) {
                audio.src = defaultTrack.audio;
                audio.currentTime = currentTime || 0;
                audio.playbackRate = playbackRate || 1;
                speedSelector.value = playbackRate || 1;

                trackTitle.textContent = defaultTrack.title;
                cover.style.backgroundImage = \`url('\${defaultTrack.cover}')\`;
            } else {
                // Highlight and load the saved track from the playlist
                const track = Array.from(document.querySelectorAll('.track')).find(
                    (t) => t.dataset.audio === currentTrack
                );
                if (track) {
                    switchTrack(track, false);
                }
            }
        } else {
            // Load the default track initially
            audio.src = defaultTrack.audio;
            trackTitle.textContent = defaultTrack.title;
            cover.style.backgroundImage = \`url('\${defaultTrack.cover}')\`;
        }

        playButton.innerHTML = "<i class='bx bx-play'></i>";
    };

    // Format time into hh:mm:ss
    const formatTime = (seconds) => {
        if (isNaN(seconds) || seconds <= 0) return '0:00';
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');

        if (hrs > 0) {
            return \`\${hrs}:\${mins}:\${secs}\`;
        } else {
            return \`\${mins}:\${secs}\`;
        }
    };

    // Highlight the active track in the playlist
    const updateActiveTrack = (element) => {
        document.querySelectorAll('.track').forEach((track) => {
            track.classList.remove('active');
            track.style.backgroundColor = ''; // Reset background
            track.style.color = ''; // Reset color
        });

        if (element) {
            element.classList.add('active');
            element.style.backgroundColor = '#5aa897'; // Active track color
            element.style.color = '#ffffff'; // Active track text color
        }
    };

    // Switch to a new track and play it
    const switchTrack = (element, playImmediately = true) => {
        const { title: newTitle, cover: newCover, audio: newAudio } = element.dataset;

        trackTitle.textContent = newTitle;
        cover.style.backgroundImage = \`url('\${newCover}')\`;
        audio.src = newAudio;

        audio.currentTime = trackPositions[newAudio] || 0;

        updateActiveTrack(element);

        if (playImmediately) {
            audio.play();
            playButton.innerHTML = "<i class='bx bx-pause'></i>";
        }
        saveProgress();
    };

    // Play/pause audio
    playButton.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playButton.innerHTML = "<i class='bx bx-pause'></i>";
        } else {
            audio.pause();
            playButton.innerHTML = "<i class='bx bx-play'></i>";
        }
        saveProgress();
    });

    // Skip backward by 15 seconds
    backwardButton.addEventListener('click', () => {
        audio.currentTime = Math.max(0, audio.currentTime - 15);
        saveProgress();
    });

    // Skip forward by 15 seconds
    forwardButton.addEventListener('click', () => {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 15);
        saveProgress();
    });

    // Change playback speed
    speedSelector.addEventListener('change', (event) => {
        audio.playbackRate = parseFloat(event.target.value);
        saveProgress();
    });

    // Update duration when metadata is loaded
    audio.addEventListener('loadedmetadata', () => {
        durationTimeDisplay.textContent = formatTime(audio.duration);
    });

    // Update progress bar and current time
    audio.addEventListener('timeupdate', () => {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = \`\${progressPercent}%\`;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
        saveProgress();
    });

    // Seek to a new position when the progress bar is clicked
    progressBar.addEventListener('click', (e) => {
        const barWidth = progressBar.offsetWidth;
        const clickX = e.offsetX;
        audio.currentTime = (clickX / barWidth) * audio.duration;
        saveProgress();
    });

    // Handle track clicks in the playlist
    playlist.addEventListener('click', (e) => {
        const trackElement = e.target.closest('.track');
        if (trackElement) {
            switchTrack(trackElement);
        }
    });

    // Load progress when the page is loaded
    window.addEventListener('load', loadProgress);

    console.log('JavaScript Loaded!');
</script>`;
    
    setJavaScriptContent(jsContent);
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