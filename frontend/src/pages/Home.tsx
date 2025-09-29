import { Box } from "@mui/material";
import ApartmentImg from "../assets/norman.png";

const Home = () => {
  return (
    <Box sx={{ mt: 2 }}>
      {/* Image container */}
      <Box
        sx={{
          width: { xs: "100%", md: "40%" },
          mx: "auto",
          height: 450, // fixed bar height, crop overflow
          overflow: "hidden",
          borderRadius: 2,
        }}
      >
        <Box
          component="img"
          src={ApartmentImg}
          alt="Apartment building"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover", // crop but don't distort
          }}
        />
      </Box>
    </Box>
  );
};

export default Home;
