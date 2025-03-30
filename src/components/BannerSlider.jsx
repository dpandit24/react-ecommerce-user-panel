import React from "react";
import { Box } from "@mui/material";
import banner1 from "../assets/portrait-young-asian-woman-isolated-blue-studio-space.jpg";

const BannerSlider = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "50vh", // Adjust height as needed
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={banner1}
        alt="Banner"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover", // Ensures image covers the area properly
        }}
      />
    </Box>
  );
};

export default BannerSlider;
