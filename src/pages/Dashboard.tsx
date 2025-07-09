import React, { useState, FormEvent, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Modal,
    TextField,
    Card,
    CardContent,
    CardActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/common/Header';

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};



const Dashboard: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [data, setData] = useState('');
    const [playlistData, setPlaylistData] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token')
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedPlaylists, setSelectedPlaylists] = useState<{ [key: string]: string }>({});
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
    const apiRoute = "http://localhost:5000/api";

    const handleOpen = (playlist?: any) => {
        if (playlist) {
            setIsEditMode(true);
            setEditingId(playlist._id);
            setName(playlist.name);
            setDescription(playlist.description);
        } else {
            setIsEditMode(false);
            setEditingId(null);
            setName('');
            setDescription('');
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setName('');
        setDescription('');
    };

    const searchSong = async () => {
        try {
            const response: any = await axios.get(`${apiRoute}/searchsong?q=${searchQuery}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error("Search error:", error);
        }
    }

    const playlist = async () => {
        try {
            const respone: any = await axios.get(`${apiRoute}/getplaylist`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            setPlaylistData(respone?.data)
        } catch (error) {
            console.log("something went wrong")
        }
    }

    const confirmDelete = async () => {
        try {
            if (!selectedDeleteId) return;

            await axios.delete(`${apiRoute}/deleteplaylist/${selectedDeleteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Playlist deleted");
            setDeleteDialogOpen(false);
            playlist();
        } catch (error) {
            console.log("something went wrong");
            toast.error("Failed to delete");
        }
    };


    useEffect(() => {
        playlist()
    }, [data])

    const addToPlaylist = async (song: any, playlistId: any) => {
        try {
            await axios.post(`${apiRoute}/playlists/${playlistId}/songs`, song, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Song added in playlist");
        } catch (error) {
            console.error("Error adding song", error);
            toast.warning("Failed to add song");

        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (isEditMode && editingId) {
                await axios.put(`${apiRoute}/editplaylist/${editingId}`,
                    { name, description },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setData('Playlist updated');
            } else {
                await axios.post(`${apiRoute}/createplaylist`,
                    { name, description },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setData('Playlist created');
            }
            setOpen(false);
            setTimeout(() => {
                navigate('/dashboard')
            }, 1500);
        } catch (error: any) {
            console.error(error.response?.data || error.message);
            setData('Something went wrong');
        }
    };

    return (
        <>
        <Header />
        <Box p={4}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <TextField
                    label="Search Song"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={searchSong}>
                    Search
                </Button>
                <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                    Create Playlist
                </Button>
            </Box>

            <Box display="flex" flexWrap="wrap" gap={2}> 
            {searchResults.map((song: any, index: any) => (
                <Card key={song.id || index} sx={{ border:"1px solid #000", width: 'calc(30%)', minWidth: 280, mt: 2, }}>
                    <CardContent>
                        <Typography variant="h6">{song.title}</Typography>
                        <Typography variant="body2">Artist: {song.artist}</Typography>
                        <Typography variant="body2">Album: {song.album}</Typography>
                    </CardContent>
                    <CardActions>
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                            <InputLabel>Select Playlist</InputLabel>
                            <Select
                                value={selectedPlaylists[song.id] || ''}
                                onChange={(e) =>
                                    setSelectedPlaylists(prev => ({ ...prev, [song.id]: e.target.value }))
                                }
                            >
                                {playlistData.map((playlist: any) => (
                                    <MenuItem key={playlist._id} value={playlist._id}>
                                        {playlist.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                                if (selectedPlaylists[song.id]) {
                                    addToPlaylist(song, selectedPlaylists[song.id]);
                                } else {
                                    alert("Please select a playlist");
                                }
                            }}
                        >
                            Add to Playlist
                        </Button>
                    </CardActions>
                </Card>
            ))}
            </Box>

            <Box display="flex" flexWrap="wrap" gap={2}>
            {playlistData.map((item: any, index: any) => {
                return (
                    <Card key={item._id || index} sx={{ border:"1px solid #000", width: 'calc(20%)', minWidth: 280, mt: 2, }}>
                        <CardContent>
                            <Typography variant="h6">
                                {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {item.description}
                            </Typography>
                        </CardContent>
                        <Box px={2} pb={1}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ textTransform: 'none' }}
                                onClick={() => navigate(`/playlist/${item._id}`)}

                            >
                                Open Playlist
                            </Button>
                        </Box>
                        <CardActions>
                            <Button size="small" variant='contained' onClick={() => handleOpen(item)}>Edit</Button>
                            <Button
                                size="small"
                                color="error"
                                variant='contained'
                                onClick={() => {
                                    setSelectedDeleteId(item._id);
                                    setDeleteDialogOpen(true);
                                }}
                            >
                                Delete
                            </Button>
                        </CardActions>
                    </Card>
                );
            })}
            </Box>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-title" variant="h6" component="h2">
                        Create a New Playlist
                    </Typography>
                    <Box>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                margin="normal"
                                multiline
                                rows={3}
                                required  
                            />
                            <Box mt={2} display="flex" justifyContent="space-between">
                                <Button onClick={handleClose} variant="outlined">
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" color="primary">
                                    Save
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Box>
            </Modal>

            <Modal
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                aria-labelledby="delete-modal-title"
            >
                <Box sx={{
                    ...modalStyle,
                    width: 300,
                    textAlign: 'center'
                }}>
                    <Typography id="delete-modal-title" variant="h6" mb={2}>
                        Are you sure you want to delete this playlist?
                    </Typography>
                    <Box display="flex" justifyContent="space-around" mt={3}>
                        <Button variant="outlined" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="error" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
        </>
    );
};

export default Dashboard;
