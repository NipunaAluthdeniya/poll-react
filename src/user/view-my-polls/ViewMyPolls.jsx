import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useState } from "react";
import { deletePollById, getMyPolls, postVoteOnPoll } from "../../services/poll/poll";
import { useNavigate } from "react-router-dom";
import { Avatar, Backdrop, Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Grid, IconButton, LinearProgress, MenuItem, Paper, Popover, Typography } from "@mui/material";
import moment from "moment/moment";
import { blue } from "@mui/material/colors";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ViewMyPolls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const open = Boolean(anchorEl);

  const handleAddVote = async (pollId, optionId) => {
        setLoading(true);
        try {
          const obj = {
            optionId: optionId,
            pollId: pollId
          }
          const response = await postVoteOnPoll(obj);
          if (response.status === 200) {
            enqueueSnackbar(`Poll voted successfully!`, {
              variant: "success",
              autoHideDuration: 5000,
            });
            fetchData();
          }
        } catch (error) {
          if (error.response && error.response.status === 406) {
            enqueueSnackbar('Poll has expired and cannot be voted on.', { variant: 'error', autoHideDuration: 5000 });
            fetchData();
          } else {
            enqueueSnackbar('Error while posting vote', { variant: 'error', autoHideDuration: 5000 });
          }
        } finally {
          setLoading(false);
        }
    }

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMyPolls();
      if (response.status === 200) {
        setPolls(response.data);
      }
    } catch (error) {
      enqueueSnackbar("Getting error while fetching polls!", {
        variant: "error",
        autoHideDuration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeletePoll = async (pollId) => {
    setLoading(true);
    try {
      await deletePollById(pollId);
      enqueueSnackbar(`Poll deleted successfully`, {
        variant: "success",
        autoHideDuration: 5000,
      });
      fetchData();
    } catch (error) {
      enqueueSnackbar("Getting error while deleting poll!", {
        variant: "error",
        autoHideDuration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePopoverOpen = (event, poll) => {
    setAnchorEl(event.currentTarget);
    setSelectedPoll(poll);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3} direction="column" alignItems="center">
          {polls.length === 0 && !loading ? (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Polls Found
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/poll/create")}
              >
                Create Poll
              </Button>
            </Box>
          ) : (
            polls.map((poll) => (
              <Grid
                item
                key={poll.id}
                xs={12}
                sm={8}
                sx={{ width: 450, maxWidth: "100%" }}
              >
                <Card sx={{ width: 450, maxWidth: "100%", mt: 3 }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: blue[500] }} aria-label="recipe">
                        {poll.username.charAt(0)}
                      </Avatar>
                    }
                    action={
                      <>
                        <IconButton
                          aria-label="settings"
                          onClick={(e) => handlePopoverOpen(e, poll)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Popover
                          sx={{ width: "10%" }}
                          open={open && selectedPoll === poll}
                          anchorEl={anchorEl}
                          onClose={handlePopoverClose}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                        >
                          <Box>
                            <MenuItem
                              onClick={() => navigate(`/poll/${poll.id}/view`)}
                            >
                              <RemoveRedEyeIcon />
                            </MenuItem>
                            <MenuItem
                              sx={{ color: "red" }}
                              onClick={() => handleDeletePoll(poll.id)}
                            >
                              <DeleteOutlineIcon />
                            </MenuItem>
                          </Box>
                        </Popover>
                      </>
                    }
                    title={poll.username}
                    subheader={moment(poll.postedDate).fromNow()}
                  />

                  <CardContent sx={{ mb: 0, pt: 0 }}>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigate(`/poll/${poll.id}/view`)}
                    >
                      <strong>{poll.question}</strong>
                    </Typography>
                    {poll.voted || poll.expired
                      ? poll.optionsDTOS.map((option) => (
                          <React.Fragment key={option.id}>
                            <div
                              style={{ position: "relative", width: "100%" }}
                            >
                              <LinearProgress
                                variant="determine"
                                value={
                                  isNaN(
                                    (option.voteCount / poll.totalVoteCount) *
                                      100,
                                  )
                                    ? 0
                                    : (option.voteCount / poll.totalVoteCount) *
                                      100
                                }
                                sx={{ height: 30, bgcolor: "#CCD7DF", mt: 1 }}
                              />
                              <div
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: 0,
                                  width: "100%",
                                  transform: "translateY(-50%)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-start",
                                  paddingLeft: "8px",
                                }}
                              >
                                <Typography variant="body2">
                                  {option.title} -{" "}
                                  {isNaN(
                                    (option.voteCount / poll.totalVoteCount) *
                                      100,
                                  )
                                    ? "0%"
                                    : `${(option.voteCount / poll.totalVoteCount) * 100}%`}
                                </Typography>
                                {option.userVotedThisOption && (
                                  <CheckCircleOutlineIcon
                                    sx={{
                                      marginLeft: "4px",
                                      fontSize: "20px",
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </React.Fragment>
                        ))
                      : poll.optionsDTOS.map((option) => (
                          <Paper
                            elevation={3}
                            sx={{ p: 1, width: "95%", mt: 1 }}
                            key={option.id}
                            onClick={() => handleAddVote(poll.id, option.id)}
                          >
                            {option.title}
                          </Paper>
                        ))}
                  </CardContent>

                  <CardActions
                    disableSpacing
                    sx={{
                      pt: 0,
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    {poll.expired ? (
                      <Typography variant="body2" color="text.secondary">
                        <strong>{poll.totalVoteCount}</strong> votes • Final
                        results
                      </Typography>
                    ) : (
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Vote: <strong>{poll.totalVoteCount}</strong>
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ ml: 2 }}
                        >
                          Expires At:{" "}
                          <strong>
                            {moment(poll.expiredAt).format(
                              "HH:mm on MMMM D, YYYY",
                            )}
                          </strong>
                        </Typography>
                      </>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
      <Backdrop
        open={loading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="success" />
      </Backdrop>
    </>
  );

};

export default ViewMyPolls;
