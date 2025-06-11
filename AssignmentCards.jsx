import * as React from "react";
import { Link } from "react-router-dom";
import {
  Card as MuiCard,
  Typography
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import FOImage from "../Images/UsersImage/UsersImage.jpg";
import CobreImage from "../Images/AssignmentImage/AssignmentImage.jpg";
import CambaceoImage from "../Images/CalendarImage/CalendarImage.jpg";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  maxWidth: "auto",
  minHeight: "auto",
  padding: theme.spacing(1),
  gap: theme.spacing(1),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("md")]: { padding: theme.spacing(1) },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const InfoCard = ({ image, title, path }) => {
  return (
    <Card>
      <CardActionArea component={Link} to={path}>
        <CardMedia
          component="img"
          height="100%"
          image={image}
          alt={title}
          loading="eager"
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="h2"
            sx={{ color: "#0288D1", fontWeight: "bold" }}
          >
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export const FOCard = () => {
  return (
    <InfoCard
      image={FOImage}
      title="Fibra Óptica"
      path="/assignments/fibra_opt"
    />
  );
};

export const CobreCard = () => {
  return (
    <InfoCard image={CobreImage} title="Cobre" path="/assignments/cobre" />
  );
};

export const CambaceoCard = () => {
  return (
    <InfoCard
      image={CambaceoImage}
      title="Cambaceo"
      path="/assignments/cambaceo"
    />
  );
};
