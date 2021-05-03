import React, { useState } from 'react';
import { Button, Form, TextArea } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';
import { FETCH_POSTS_QUERY } from '../utils/graphql';

const PostForm = () => {
  const [values, setValues] = useState({
    body: '',
  });

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const [createPost, { error }] = useMutation(CREATE_POST, {
    variables: values,
    update(proxy, result) {
      // NOTE: reading and writing data to the cache

      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });

      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });

      values.body = '';
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    createPost();
  };
  return (
    <div className='post-form-wrapper'>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>

        <TextArea
          placeholder='Tell us more'
          style={{ minHeight: 70, marginBottom: '1rem' }}
          name='body'
          value={values.body}
          onChange={onChange}
          error={error ? true : false}
        />

        <Button type='submit' color='teal'>
          Post
        </Button>
      </Form>

      {error && (
        <div className='ui error message'>
          <ul className='list'>
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      username
      createdAt
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
