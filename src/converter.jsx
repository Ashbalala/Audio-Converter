import React, { useState } from "react";
import {
  Container,
  Button,
  Typography,
  Paper,
  Input,
  Box,
  TextField,
} from "@mui/material";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const Converter = () => {
  const [files, setFiles] = useState([]);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [findReplacePairs, setFindReplacePairs] = useState([{ find: "", replace: "" }]);

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles(uploadedFiles);
  };

  const handlePairChange = (index, field, value) => {
    const updatedPairs = [...findReplacePairs];
    updatedPairs[index][field] = value;
    setFindReplacePairs(updatedPairs);
  };

  const addFindReplacePair = () => {
    setFindReplacePairs([...findReplacePairs, { find: "", replace: "" }]);
  };

  const processFiles = () => {
    const updatedFiles = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          let content = e.target.result;

          // Remove all newline characters and normalize the text
          content = content.replace(/(\r\n|\n|\r)/g, " ");

          // Remove "Landmarks" at the very beginning
          content = content.replace(/^Landmarks/, "");

          // Apply all find and replace operations
          findReplacePairs.forEach(({ find, replace }) => {
            if (find) {
              const regex = new RegExp(`\\b${find}\\b`, "gi");
              content = content.replace(regex, replace);
            }
          });

          resolve({ name: file.name, content: content });
        };
        reader.readAsText(file);
      });
    });

    Promise.all(updatedFiles).then((results) => {
      setProcessedFiles(results);
    });
  };

  const downloadFile = (file) => {
    const blob = new Blob([file.content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = file.name;
    link.click();
  };

  const downloadAllFiles = () => {
    const zip = new JSZip();

    processedFiles.forEach((file) => {
      zip.file(file.name, file.content);
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "processed-files.zip");
    });
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
      <Typography variant="h3" gutterBottom>
        Bulk File Converter
      </Typography>
      <Paper sx={{ p: 4, mt: 4, width: "100%" }} elevation={4}>
        <Input
          type="file"
          inputProps={{ multiple: true }}
          onChange={handleFileUpload}
        />
        <Box sx={{ mt: 4, width: "100%" }}>
          {findReplacePairs.map((pair, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                mb: 2,
              }}
            >
              <TextField
                label="Find Text"
                variant="outlined"
                fullWidth
                value={pair.find}
                onChange={(e) => handlePairChange(index, "find", e.target.value)}
              />
              <TextField
                label="Replace With"
                variant="outlined"
                fullWidth
                value={pair.replace}
                onChange={(e) =>
                  handlePairChange(index, "replace", e.target.value)
                }
              />
            </Box>
          ))}
          <Button
            variant="outlined"
            onClick={addFindReplacePair}
            sx={{ mt: 2 }}
          >
            Add Find & Replace
          </Button>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={processFiles}
          sx={{ mt: 2 }}
        >
          Process Files
        </Button>
        {processedFiles.length > 0 && (
          <Button
            variant="contained"
            color="secondary"
            onClick={downloadAllFiles}
            sx={{ mt: 2 }}
          >
            Download All Files
          </Button>
        )}
        <Box sx={{ mt: 4 }}>
          {processedFiles.map((file, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography>{file.name}</Typography>
              <Button variant="outlined" onClick={() => downloadFile(file)}>
                Download
              </Button>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default Converter;