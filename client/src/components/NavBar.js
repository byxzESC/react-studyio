import React, { useState } from "react";
import { Navbar, Nav, Container, Modal, Button } from "react-bootstrap";
import logo from "../images/logo-yellow.png";
import SignUpForm from "./SignupForm";
import LoginForm from "./LoginForm";
import Auth from "../utils/auth";
import { useNavigate } from "react-router-dom";

const AppNavbar = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
    navigate('/')
  };

  // const [login, { error }] = useMutation(LOGIN_USER);

  // const decks = async (values, actions) => {
  //   try {
  //     const { data } = await login({
  //       variables: { ...values },
  //     });

  //     const user = data.login.user.username;

  //     // Auth.login(data.login.token);
  //     window.location.assign(`/${user}/decks`);
  //   } catch (error) {
  //     console.error(error);
  //     // setShowAlert(true);
  //   }

  //   actions.resetForm();
  // };

  const viewDecks = async () => {
    try {
      const { data: { username } } = Auth.getProfile()
      console.log(username);
      navigate(`/${username}/decks`);
     
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar id="navbar">
        <Container>
          <Navbar.Brand href="/" id="title">
            <img className="navbar-logo" src={logo} alt="logo" />
            STUDY.io
          </Navbar.Brand>

          <Nav className="ml-auto">
            {Auth.loggedIn() ? (
              <>
                <Button
                  variant="secondary"
                  onClick={logout}
                  style={{ backgroundColor: "#F7C04A" }}
                  className="btn"
                >
                  Logout
                </Button>
                <Button
                  variant="secondary"
                  onClick={viewDecks}
                  style={{ backgroundColor: "#F7C04A" }}
                  className="btn"
                >
                  Decks
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  onClick={handleShow}
                  style={{ backgroundColor: "#F7C04A" }}
                  className="btn"
                >
                  Log In
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleShowLogin}
                  style={{ backgroundColor: "#3F497F" }}
                  className="btn"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
      {/* login modal */}
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-text" id="login-modal">
            Log In
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* pass close model */}
          <LoginForm handleModalClose={() => setShow(false)} />
        </Modal.Body>
      </Modal>
      {/* create account modal */}
      <Modal
        show={showLogin}
        onHide={handleCloseLogin}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-text" id="signup-modal">
            Create an Account
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SignUpForm handleModalClose={() => setShowLogin(false)} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AppNavbar; 