import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import { Container, Nav } from "react-bootstrap";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dropdown from "react-bootstrap/Dropdown";

const Register = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("Select User");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    type: "",
  });

  const handleSelect = (eventKey) => {
    setSelectedOption(eventKey);
    setData({ ...data, type: eventKey.toLowerCase() });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        alert(result.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration Error:", err);
      alert("Something went wrong. Try again later.");
    }
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand>
            <h2>Study App</h2>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" navbarScroll></Nav>
            <Nav>
              <Link to={"/"}>Home</Link>
              <Link to={"/login"}>Login</Link>
              <Link to={"/register"}>Register</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="first-container">
        <Container
          component="main"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              marginTop: 8,
              marginBottom: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px",
              background: "#dddde8db",
              border: "1px solid lightblue",
              borderRadius: "5px",
            }}
          >
            <Avatar sx={{ bgcolor: "secondary.main" }} />
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                value={data.name}
                onChange={handleChange}
                autoComplete="name"
                autoFocus
              />
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={data.email}
                onChange={handleChange}
                autoComplete="email"
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                value={data.password}
                onChange={handleChange}
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Dropdown className="my-3">
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id="dropdown-basic"
                >
                  {selectedOption}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleSelect("student")}>
                    student
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSelect("teacher")}>
                    Teacher
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Box mt={2} display="flex" justifyContent="center">
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, width: "200px" }}
                >
                  Sign Up
                </Button>
              </Box>
              <Grid container>
                <Grid item>
                  Have an account?
                  <Link style={{ color: "blue" }} to={"/login"}>
                    {" Sign In"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default Register;
