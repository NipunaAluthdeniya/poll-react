import { Avatar, Backdrop, Button, CircularProgress, Container, CssBaseline, TextField, Typography, Grid, Box, Link } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useSnackbar } from 'notistack';
import { signup } from '../../../services/auth/auth';
import { saveToken } from '../../../utility/common';

const defaultTheme = createTheme();

const Signup = () => {
    const { enqueueSnackbar} = useSnackbar();
    const[formData, setFormData] = useState({
            email: '',
            password: '',
            firstName: '',
            lastName: ''
        });
    const[loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await signup(formData);
            if(response.status === 201) {
                const responseData = response.data;
                saveToken(responseData.jwtToken);
                navigate('/dashboard');
                enqueueSnackbar(`Welcome ${responseData.name}`, { variant: 'success', autoHideDuration: 5000 });
            }
        } catch (error) {
            if (error.response && error.response.data === 409) {
                enqueueSnackbar('User already exists!', { variant: 'error', autoHideDuration: 5000 });
            } else {
                enqueueSnackbar('Sign up failed!', { variant: 'error', autoHideDuration: 5000 });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    > 
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>

                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    name="lastName"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    autoComplete="family-name"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12}}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12}}>
                                <TextField
                                    required
                                    fullWidth
                                    id="password"
                                    label="Password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={!formData.email || !formData.password || !formData.firstName || !formData.lastName}
                        >
                            {loading ? <CircularProgress color="success" size={24} /> : 'Sign Up'}
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link variant="body2" onClick={() => navigate('/login')}>
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                    </Box>
            </Container>
        </ThemeProvider>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
        >
            <CircularProgress color="success" />
        </Backdrop>
        </>
    );
};

export default Signup;