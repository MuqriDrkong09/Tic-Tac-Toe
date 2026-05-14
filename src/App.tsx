import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Game from "./components/Game.tsx";

export default function App() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4 },
            textAlign: "center",
          }}
        >
          <Typography variant="h1" color="primary" gutterBottom>
            Tic-Tac-Toe
          </Typography>
          <Game />
        </Paper>
      </Container>
    </Box>
  );
}
