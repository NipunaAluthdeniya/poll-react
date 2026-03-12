import { Avatar, Backdrop, Button, CircularProgress, Container, CssBaseline, TextField, Typography, Grid, Box, Link } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useSnackbar } from 'notistack';
import { login } from '../../../services/auth/auth';
import { saveToken } from '../../../utility/common';

const defaultTheme = createTheme();

const Login = () => {
    const { enqueueSnackbar} = useSnackbar();
    const[formData, setFormData] = useState({
        email: '',
        password: ''
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
                const response = await login(formData);
                if(response.status === 200) {
                    const responseData = response.data;
                    saveToken(responseData.jwtToken);
                    navigate('/dashboard');
                    enqueueSnackbar(`Welcome ${responseData.name}`, { variant: 'success', autoHideDuration: 5000 });
                }
            } catch (error) {  
                enqueueSnackbar('Sign in failed!', { variant: 'error', autoHideDuration: 5000 });
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
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={!formData.email || !formData.password}
                        >
                            {loading ? <CircularProgress color="success" size={24} /> : 'Sign In'}
                        </Button>
                        <Grid container>
                            <Grid>
                                <Link variant="body2" onClick={() => navigate('/register')}>
                                    {"Don't have an account? Sign Up"}
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

export default Login;