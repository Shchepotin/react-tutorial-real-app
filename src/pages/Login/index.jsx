import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Grid,
  makeStyles,
  Container,
  Button,
  Typography,
} from "@material-ui/core";
import { yupResolver } from "@hookform/resolvers/yup";
import validationSchema from "./validation";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  buttonSpacing: {
    marginLeft: theme.spacing(1),
  },
}));

function Login() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const { data: loginData } = await api.auth.login(data);

      auth.setToken(loginData.token);
      auth.setUser(loginData.user);
    } catch (e) {
      if (e.response.status === 422) {
        Object.keys(e.response.data.errors).forEach((key) => {
          setError(key, {
            type: "manual",
            message: e.response.data.errors[key],
          });
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">Login</Typography>
        </Grid>
      </Grid>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  error={Boolean(errors.email?.message)}
                  fullWidth={true}
                  type="email"
                  label="Email"
                  variant="filled"
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  error={Boolean(errors.password?.message)}
                  type="password"
                  fullWidth={true}
                  label="Password"
                  variant="filled"
                  helperText={errors.password?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isLoading}
            >
              Login
            </Button>
            <Button
              color="inherit"
              className={classes.buttonSpacing}
              component={Link}
              to="/registration"
            >
              Create an account
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default Login;
