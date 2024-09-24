import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { SnackbarProvider } from 'notistack';

const client = new ApolloClient({
  uri: 'https://normal-jaguar-26.hasura.app/v1/graphql', 
  headers: {
    'x-hasura-admin-secret': 'gmNflxcFtWLQQwD1iqXwoYqruQ84zS9lxNyimYtxO8pcHNePpPtI4X1QDvIi4BNT',  
  },
  cache: new InMemoryCache(),
});


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
     <SnackbarProvider maxSnack={3}>
    <App />
  </SnackbarProvider>
  </ApolloProvider>
  </React.StrictMode>
);

 

