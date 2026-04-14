import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { 
  Typography, 
  Container, 
  Box, 
  TextField, 
  InputLabel, 
  FormControl, 
  Select, 
  MenuItem, 
  CircularProgress,
  Button,
  Alert,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateReply = async () => {
    if (!emailContent.trim()) {
      setError('Please enter the original email content');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedReply('');

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/generate-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailContent,
          tone: tone || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate reply');
      }

      const data = await response.json();
      setGeneratedReply(data.reply || 'No reply generated');
    } catch (err) {
      setError(err.message || 'An error occurred while generating the reply');
      // For demo purposes, generate a mock reply
      setTimeout(() => {
        const mockReply = `Thank you for your email regarding "${emailContent.substring(0, 50)}...".\n\nI appreciate you reaching out and will review your message carefully. ${tone ? `I'll respond in a ${tone} manner.` : ''}\n\nBest regards`;
        setGeneratedReply(mockReply);
        setLoading(false);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedReply);
  };

  const handleClear = () => {
    setEmailContent('');
    setTone('');
    setGeneratedReply('');
    setError('');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Email Reply Generator
      </Typography>

      <Box sx={{ mx: 3 }}>
        <TextField 
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 3 }}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select
            value={tone}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
            disabled={loading}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
            
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={handleClear}
            disabled={loading}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            onClick={handleGenerateReply}
            disabled={loading || !emailContent.trim()}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            sx={{ minWidth: 150 }}
          >
            {loading ? 'Generating...' : 'Generate Reply'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Box sx={{ mx: 3, mt: 2 }}>
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Box>
      )}

      {generatedReply && (
        <Box sx={{ mx: 3, mt: 3 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Generated Reply
              </Typography>
              <Tooltip title="Copy to clipboard">
                <IconButton onClick={handleCopyToClipboard} color="primary">
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              value={generatedReply}
              onChange={(e) => setGeneratedReply(e.target.value)}
            />
          </Paper>
        </Box>
      )}
    </Container>
  );
}

export default App;
