import {
  Autocomplete,
  Button,
  Chip,
  TextField,
  Box,
  Avatar,
  Typography,
  Container,
  CircularProgress,
  Backdrop,
  CssBaseline,
} from "@mui/material";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postPoll } from "../../services/poll/poll";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const defaultTheme = createTheme();

const CreatePoll = () => {
  const [formData, setFormData] = useState({
    question: "",
    options: [],
    expiredAt: null,
  });
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const obj = {
        question: formData.question,
        options: formData.options,
        expiredAt: formData.expiredAt.$d,
      };
      const response = await postPoll(obj);
      if (response.status === 201) {
        navigate("/dashboard");
        enqueueSnackbar(`Poll posted successfully`, {
          variant: "success",
          autoHideDuration: 5000,
        });
      }
    } catch (error) {
      enqueueSnackbar("Getting error while creating poll!", {
        variant: "error",
        autoHideDuration: 5000,
      });
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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <HowToVoteIcon />
            </Avatar>

            <Typography component="h1" variant="h5">
              Create Poll
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                id="outlined-multiline-static"
                label="Enter Question"
                multiline
                rows={2}
                required
                sx={{ width: "70ch" }}
                autoFocus
                margin="normal"
                name="question"
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
              />
              <Autocomplete
                multiple
                sx={{ width: "70ch" }}
                options={[]}
                freeSolo
                value={formData.options}
                onChange={(event, newValue) =>
                  setFormData({ ...formData, options: newValue })
                }
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={index}
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="normal"
                    label="Options"
                    name="options"
                  />
                )}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  sx={{ width: "70ch", mt: 3 }}
                  label="Expiration Date"
                  value={formData.expiredAt}
                  onChange={(date) =>
                    setFormData({ ...formData, expiredAt: date })
                  }
                />
              </LocalizationProvider>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={
                  !formData.question || !formData.options || !formData.expiredAt
                }
              >
                {loading ? (
                  <CircularProgress color="success" size={24} />
                ) : (
                  "Post"
                )}
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
      <Backdrop
        open={loading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="success" />
      </Backdrop>
    </>
  );
};

export default CreatePoll;
