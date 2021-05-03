import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { gql, useMutation } from '@apollo/client';

import { Button, Form } from 'semantic-ui-react';

import { AuthContext } from '../Context/Auth';

const Login = () => {
  const context = useContext(AuthContext);

  const [values, setValues] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const history = useHistory();

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    async update(_, result) {
      // console.log(result);
      const userData = result.data.login;

      await context.login(userData);

      history.push('/');
    },
    variables: values,
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    loginUser();
  };

  return (
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1 className='page-title'>Register</h1>
        <Form.Input
          label='Username'
          placeholder='Username'
          type='text'
          name='username'
          value={values.username}
          onChange={onChange}
          error={errors.username ? true : false}
        ></Form.Input>

        <Form.Input
          label='Password'
          placeholder='Password'
          type='password'
          name='password'
          value={values.password}
          onChange={onChange}
          error={errors.password ? true : false}
        ></Form.Input>

        <Button type='submit' primary style={{ width: '100%' }}>
          Login
        </Button>
      </Form>

      {Object.values(errors).length > 0 && (
        <div className='ui error message'>
          <ul className='list'>
            {Object.values(errors).map((value, index) => (
              <li key={index}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      token
      email
      createdAt
    }
  }
`;

export default Login;
