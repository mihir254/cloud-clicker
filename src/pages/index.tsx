import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';

import { Flex, Text, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, Spinner, Heading } from "@chakra-ui/react";
import { TiArrowDownThick, TiArrowUpThick } from "react-icons/ti";

import Dashboard from './dashboard';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/LoginForm';
import { useFirestore } from '@/hooks/useFirestore';
import CustomButton from '@/components/CustomButton';

const Home: React.FC = () => {
  const toast = useToast();
  const { user, login, signup, logout, isLoading, error, setError } = useAuth();
  const { clicks, userClicks } = useFirestore();
  const [isModalOpen, setIsModalOpen] = useState <boolean> (false);
  const [isSignup, setIsSignup] = useState <boolean> (false);
  const [clickLoading, setClickLoading] = useState <boolean> (false);

  const handleButtonClick = async () => {
    if (!user) {
      toast({
          title: 'Unauthorized',
          description: "You must be logged in to perform this action",
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-left'
      });
      return;
    }
    setClickLoading(true);
    try {
      const auth = getAuth();
      const clickUser = auth.currentUser;
      if (clickUser) {
        const token = await clickUser.getIdToken();
        const response = await fetch('/api/clicks/update', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
        });
        if (response.status === 429) {
          toast({
            title: 'Too many clicks! You need to slow down.',
            description: "Only 15 clicks are allowed every minute)",
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'bottom-left'
          });
        } else if (response.ok) {
          const result = await response.json();
          toast({
              title: 'Got it!',
              description: "Your click was registered!",
              status: 'success',
              duration: 3000,
              isClosable: true,
              position: 'bottom-left'
          });
        } else {
          throw new Error('Failed to register click');
        }
      }
    } catch (error: any) {
        toast({
            title: 'Error',
            description: error.message || 'Failed to process click',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'bottom-left'
        });
    } finally {
      setClickLoading(false);
    }
  };

  const handleAuthAction = async (formData: { email: string; password: string; username?: string }) => {
    try {
      if (isSignup) {
        await signup(formData.email, formData.password, { username: formData.username ?? '', email: formData.email });
      } else {
        await login(formData.email, formData.password);
      }
      toast({
          title: 'Welcome to Cloud Clicker!',
          description: isSignup ? "Signed up successfully" : "Logged in successfully",
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'bottom-left'
      });
      setIsModalOpen(false);
    } catch (err: any) {
      toast({
          title: isSignup ? 'Could not create account' : "Could not log you in",
          description: err.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-left'
      });
    }
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      toast({
          title: 'Sad to see you go!',
          description: "Logged out successfully",
          status: 'info',
          duration: 3000,
          isClosable: true,
          position: 'bottom-left'
      });
    } catch (err: any) {
      toast({
          title: 'Could not let you go!',
          description: "Something went wrong while logging you out",
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-left'
      });
    }
  };

  const scrollToView = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <Flex id='home' cursor={clickLoading ? "wait" : ""} direction={"column"} alignItems={"center"} justifyContent={"center"} px={12}>
      <Flex height={"100vh"} direction={"column"} alignItems={"center"} justifyContent={"center"}>
        <Flex position={"absolute"} top={0} width={"100%"} height={"80px"} alignItems={"center"} px={20} justifyContent={{base: "flex-start", md: "flex-end"}}>
          {user && <Text fontSize={{base: 12, md: 15}}>Logged in as <Text as={'span'} color={"steelblue"} decoration={"underline"} fontWeight={"600"}>{user.username}</Text></Text>}
        </Flex>
        <Flex direction={"column"} gap={"20px"}>
          <Flex alignItems={"center"} justifyContent={"center"}>
            <Heading size={{base: "lg", md: "xl"}} textAlign={"center"}>A total of <Text as={"span"} decoration={"underline"} color={"steelblue"}>{clicks}</Text> clicks have been registered.</Heading>
          </Flex>
          <Flex alignItems={"center"} justifyContent={"center"}>
          {user ?
            <Heading size={{base: "lg", md: "xl"}} textAlign={"center"}>You have contributed to <Text as={"span"} decoration={"underline"} color={"steelblue"}>{userClicks}</Text> clicks.</Heading> :
            <Text textAlign={"center"}>You need to login before contributing</Text>  
          }
          </Flex>
          <Flex alignItems={"center"} justifyContent={"center"}>
            {user && <Text textAlign={"center"}>Use the <Text fontSize={{base: 14, md: 16}} fontFamily={"monospace"} fontWeight={"600"} as={"span"}>"CLICK ME!"</Text> button to contribute more</Text>}
          </Flex>
        </Flex>
        <Flex margin={10} marginTop={20} direction={"column"} gap={"20px"} >
          {user ?
            <CustomButton text='Click Me!' onClick={handleButtonClick} loading={clickLoading}/> :
            <CustomButton text='login' onClick={() => setIsModalOpen(true)} loading={clickLoading}/>
          }
        </Flex>
        {user && <CustomButton text='logout' onClick={handleLogoutClick} loading={clickLoading}/>}

        <Modal size={{base: "xs", md: "md"}} isOpen={isModalOpen || isLoading} onClose={() => {setIsModalOpen(false); setError('');}} isCentered={true}>
            <ModalOverlay />
            {isLoading ?
            <ModalContent width={"50px"} height={"50px"} justifyContent={"center"} alignItems={"center"}>
              <Spinner thickness='4px' speed='0.8s' color="steelblue" emptyColor='black'/>
            </ModalContent> :
            <ModalContent>
                <ModalHeader>{isSignup ? 'Welcome to Cloud Clicker!' : 'Are you an existing user?'}</ModalHeader>
                <ModalCloseButton />
                <LoginForm
                    onSubmit={handleAuthAction}
                    isSignup={isSignup}
                    onChangeMode={() => setIsSignup(!isSignup)}
                    error={error}
                />
            </ModalContent>}
        </Modal>
        <Flex position={"absolute"} top={"85vh"}>
          <TiArrowDownThick size={30} cursor={"pointer"} onClick={() => scrollToView('dashboard')} color="gray"/>
        </Flex>
        <Flex position={"absolute"} bottom={"5vh"} right={"5vw"}>
          <TiArrowUpThick size={30} cursor={"pointer"} onClick={() => scrollToView('home')} color="gray"/>
        </Flex>
      </Flex>
      <Dashboard />
    </Flex>
  );
};

export default Home;