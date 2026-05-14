import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function App() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h1" color="primary" gutterBottom>
            Tic-Tac-Toe
          </Typography>
          <Typography variant="body1" color="text.secondary">
            MUI theme is configured. Game components coming next.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
