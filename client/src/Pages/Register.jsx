import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { gql, useMutation } from '@apollo/client';

import { Button, Form } from 'semantic-ui-react';

import { AuthContext } from '../Context/Auth';

const Register = () => {
  const context = useContext(AuthContext);

  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const history = useHistory();

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, result) {
      // console.log(result);
      const userData = result.data.register;
      context.login(userData);
      history.push('/');
    },
    variables: values,
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    addUser();
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
          label='Email'
          placeholder='Email'
          type='email'
          name='email'
          value={values.email}
          onChange={onChange}
          error={errors.email ? true : false}
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

        <Form.Input
          label='Confirm Password'
          placeholder='Confirm Password'
          type='password'
          name='confirmPassword'
          value={values.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword ? true : false}
        ></Form.Input>

        <Button type='submit' primary style={{ width: '100%' }}>
          Register
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

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      username
      token
      email
      createdAt
    }
  }
`;

export default Register;
