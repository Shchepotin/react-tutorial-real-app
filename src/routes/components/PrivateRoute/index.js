import { Route, Redirect } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) => {
        const url = new URLSearchParams();
        url.set("redirect", location.pathname + location.search);

        return auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              search: url.toString(),
            }}
          />
        );
      }}
    />
  );
}

export default PrivateRoute;
