import logo from "./moralislogo.png";
import React, { useState } from "react";
import "./App.css";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import { Button, Box, Input, Heading } from "@chakra-ui/react";
import { Container, Center } from "@chakra-ui/react";

const LogoutButton = () => {
  const { logout, isAuthenticating } = useMoralis();

  return (
    <Button
      display={"block"}
      colorScheme="red"
      variant="solid"
      isLoading={isAuthenticating}
      onClick={() => logout()}
      disabled={isAuthenticating}>
      Logout
    </Button>
  );
};

// ---------- APP -------------
function App() {
  const { login, isAuthenticated, authenticate, Moralis } = useMoralis();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleUsernameChange = (event) => setUsername(event.target.value);

  const {
    fetch: callEmailCloudFunction,
    data,
    error,
    isLoading,
  } = useMoralisCloudFunction(
    "sendWelcomeEmail",
    {
      email: email,
      name: username,
    },
    { autoFetch: false }
  );

  const signupFunc = async () => {
    console.log(username, password, email);

    const user = new Moralis.User();
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);

    try {
      await user.signUp();
      alert("succesfully Signed up");
      // Hooray! Let them use the app now.
    } catch (error) {
      // Show the error message somewhere and let the user try again.
      alert("Error: " + error.code + " " + error.message);
    }

    // login(username, password, email);
  };

  const loginUsingUsername = async () => {
    login(username, password);
  };

  //Login Only using Wallet
  //
  const loginUsingMetamask = () => {
    authenticate();
  };

  //Send welcome email to user
  const sendWelcomeEmail = () => {
    //pick the user email from state
    callEmailCloudFunction();
  };

  const resetPassword = () => {
    //getting email from email input
    if (email) {
      Moralis.User.requestPasswordReset(email)
        .then(() => {
          alert("Successfully Password Email Sent");
          // Password reset request was sent successfully
        })
        .catch((error) => {
          // Show the error message somewhere
          alert("Error: " + error.code + " " + error.message);
        });
    } else {
      alert("Enter email first");
    }
  };

  // ----- Authenticate page---------
  if (!isAuthenticated) {
    return (
      <Container maxW="container.lg" p={50}>
        <Center>
          <img width={400} height={400} src={logo} alt="logo" />
        </Center>
        <br />
        <Center>
          <Heading as="h2" size="3xl" p={10}>
            Email Auth Demo
          </Heading>
        </Center>

        <Center>
          <Input
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
            size="sm"
          />
          <Input
            value={password}
            onChange={handlePasswordChange}
            placeholder="password"
            size="sm"
          />
          <Input
            value={username}
            onChange={handleUsernameChange}
            placeholder="username"
            size="sm"
          />
        </Center>
        <br />

        <Center>
          <Button colorScheme="green" size="lg" onClick={signupFunc}>
            Sign up using username and password
          </Button>
        </Center>
        <br />

        <Center>
          <Button colorScheme="green" size="lg" onClick={loginUsingUsername}>
            Sign in using username and password
          </Button>
        </Center>
        <br />

        <Center>
          <Button colorScheme="green" size="lg" onClick={loginUsingMetamask}>
            Sign up/in using Metamask
          </Button>
        </Center>
        <br />

        <Center>
          <Button colorScheme="green" size="lg" onClick={sendWelcomeEmail}>
            Send Welcome Email for{" "}
            {email ? email : "[Please enter email in field]"}
          </Button>
        </Center>
        <br />
        <Center>
          <Button colorScheme="green" size="lg" onClick={resetPassword}>
            Request Password change for{" "}
            {email ? email : "[Please enter email in field]"}
          </Button>
        </Center>
      </Container>
    );
  }

  return (
    <Box display={"block"} p={35} className="App">
      <LogoutButton />
      <Center>
        <img width={500} height={500} src={logo} alt="logo" />
      </Center>

      <Center>
        <Heading as="h2" size="3xl" p={10}>
          Email Auth Demo
        </Heading>
      </Center>

      <Center>
        <Heading as="h2" size="xl" p={10}>
          Logged In
        </Heading>
      </Center>
    </Box>
  );
}

export default App;
