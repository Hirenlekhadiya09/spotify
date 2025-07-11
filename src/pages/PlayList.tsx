import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const PlayList: React.FC = () => {
  const [playlist, setPlaylist] = useState<any>(null);
  const token = localStorage.getItem('token');
  const { id } = useParams();
  const navigate = useNavigate();
  // const apiRoute = 'http://localhost:5000/api';
  const apiRoute = "https://spotify-zov4.onrender.com/api";


  const getPlaylist = async () => {
    try {
      const response = await axios.get(`${apiRoute}/getplaylist/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlaylist(response.data);
    } catch (error) {
      console.error('Error fetching playlist', error);
    }
  };

  useEffect(() => {
    getPlaylist();
  }, [id]);

  if (!playlist) {
    return (
      <Box p={4}>
        <Typography variant="h6">Loading playlist...</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Button  variant="contained" onClick={() => navigate('/dashboard')} sx={{ mb: 2 , textTransform: 'none'}}>
        Back to Dashboard
      </Button>

      <Typography variant="h4" gutterBottom>
        {playlist.name}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={2}>
        {playlist.description}
      </Typography>

      <Typography variant="h6" mb={2}>Songs:</Typography>

      {playlist.songs && playlist.songs.length > 0 ? (
        <Box>
          {playlist.songs.map((song: any, index: number) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{song.title}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">Artist: {song.artist}</Typography>
                <Typography variant="body2">Album: {song.album}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography>No songs in this playlist.</Typography>
      )}
    </Box>
  );
};

export default PlayList;
