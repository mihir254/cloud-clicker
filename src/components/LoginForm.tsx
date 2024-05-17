import React, { FormEvent, useRef, useState, useCallback } from 'react';

import { Button, Input, Flex, Text } from "@chakra-ui/react";

import { AuthData } from '@/interfaces/interface';

interface LoginFormProps {
  onSubmit: (data: AuthData) => void;
  isSignup: boolean;
  onChangeMode: () => void;
  error: string;
}

const LoginForm = (props: LoginFormProps) => {
  const { onSubmit, isSignup, onChangeMode, error } = props;

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState <string> ('');

  const isValidUsername = useCallback ((username: string) => {
    const re = /^[A-Za-z][A-Za-z0-9_]{6,29}$/;
    return re.test(username);
  }, []);

  const isValidEmail = useCallback ((email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';
    const username = usernameRef.current?.value || '';

    if (isSignup && !isValidUsername(username)) {
      setValidationError('Invalid username (7-28 characters; alphabets, numbers, _ only. Should start with alphabets)');
      usernameRef.current?.focus();
      return;
    }

    if (!isValidEmail(email)) {
      setValidationError('Please enter a valid email address');
      emailRef.current?.focus();
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      passwordRef.current?.focus();
      return;
    }

    onSubmit({ email, password, username });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction={"column"} padding={6} gap={"15px"} justifyContent={"space-between"}>
        {isSignup && <Input ref={usernameRef} name='username' placeholder='Username' isRequired={true} />}
        <Input ref={emailRef} name='email' type='email' placeholder='Email' isRequired={true} />
        <Input ref={passwordRef} name='password' type='password' placeholder='Password' isRequired={true} />
        {(error || validationError) && <Text color={'red'}>{validationError ? validationError : error}</Text>}
        <Flex direction={"column"} gap={"5px"} userSelect={"none"}>
          <Button colorScheme='blue' type='submit'>{isSignup ? "SIGNUP" : "LOGIN"}</Button>
          {isSignup ?
            <Text>Do you want to <Text as={"span"} decoration={"underline"} color={"#3182CE"} cursor={"pointer"} onClick={onChangeMode}>Login</Text> instead?</Text> :
            <Text>Do you want to <Text as={"span"} decoration={"underline"} color={"#3182CE"} cursor={"pointer"} onClick={onChangeMode}>Signup</Text> instead?</Text>
          }
        </Flex>
      </Flex>
    </form>
  );
};

export default LoginForm;
