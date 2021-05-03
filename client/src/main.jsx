import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import App from './App';

// apollo client
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

const token = localStorage.getItem('jwtToken');

const client = new ApolloClient({
  uri: 'http://localhost:5000',
  cache: new InMemoryCache(),
  headers: {
    authorization: token ? `Bearer ${token}` : '',
  },
});

ReactDOM.render(
  // <React.StrictMode>
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  // </React.StrictMode>,
  document.getElementById('root')
);
