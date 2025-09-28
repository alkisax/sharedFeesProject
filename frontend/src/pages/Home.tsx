import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <Button
        component={Link}
        to="/admin"
        variant="contained"
        color="primary"
      >
        Admin Dashboard
      </Button>
    </div>
  );
};

export default Home;
