import React, { memo } from 'react';

import { Flex, Text } from '@chakra-ui/react';

import styles from './button.module.css';

interface PropType {
  text: string,
  onClick: () => void,
  loading: boolean
}

const CustomButton = (props: PropType) => {
  const {text, onClick, loading} = props;
  
  return (
    <Flex cursor={loading ? "wait" : ""} className={text === 'logout' ? styles.a1 : styles.a} onClick={() => !loading && onClick()}>
      <Text fontSize={{base: 18, md: 20}} as={"span"} className={styles.s}>{text}</Text>
      <i className={styles.i} />
    </Flex>
  )
}

export default memo(CustomButton);