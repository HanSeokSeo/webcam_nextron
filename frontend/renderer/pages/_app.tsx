import { ApolloProvider } from "@apollo/client";
import { useApollo } from "@lib";
import store from "@store/patient";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import "../styles/globals.css";

interface MyAppProps extends AppProps {
  pageProps: {
    initialApolloState?: any;
  };
}

function MyApp({ Component, pageProps }: MyAppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  
  return (
    <ThemeProvider attribute="class">
      <Provider store={store}>
        <ApolloProvider client={apolloClient}>
          <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 dark:text-white text-black">
            <Component {...pageProps} />
          </div>    
        </ApolloProvider>
      </Provider>
    </ThemeProvider>
  )
}

export default MyApp
