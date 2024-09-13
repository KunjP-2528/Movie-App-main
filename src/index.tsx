import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { SnackbarProvider } from 'notistack';

const client = new ApolloClient({
  uri: 'https://lenient-dove-39.hasura.app/v1/graphql', 
  headers: {
    'x-hasura-admin-secret': 'BA6u1r5a5tEOR28bJyfgZW1XwMFFHj6lAtGh9xxVwZT90XQdtgP7HAG9hR7wXQIL',  
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

 

