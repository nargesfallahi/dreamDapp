import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { Provider } from '../components/app-provider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Provider>
        <Component {...pageProps} />
      </Provider>
    </ChakraProvider>
  );
}
