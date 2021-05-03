import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import { AuthProvider } from './Context/Auth';

import Header from './Components/Header';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import AuthRoute from './utils/AuthRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <Header />
          <Route exact path='/' component={Home} />
          <AuthRoute exact path='/login' component={Login} />
          <AuthRoute exact path='/register' component={Register} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
