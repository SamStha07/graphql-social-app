import React, { useContext } from 'react';

import { gql, useQuery } from '@apollo/client';

import { Grid, Image, Transition } from 'semantic-ui-react';
import PostCard from '../Components/PostCard';
import PostForm from '../Components/PostForm';
import { AuthContext } from '../Context/Auth';

const Home = () => {
  const { loading, error, data } = useQuery(FETCH_POSTS_QUERY);

  const { user } = useContext(AuthContext);

  if (error) {
    return `Error: ${error.message}`;
  }

  return (
    <Grid columns={3}>
      <Grid.Row className='page-title'>Recent Posts</Grid.Row>

      {user && (
        <Grid.Row>
          <PostForm />
        </Grid.Row>
      )}

      <Grid.Row>
        {loading ? (
          <p>Loading</p>
        ) : (
          <Transition.Group>
            {data &&
              data.getPosts &&
              data.getPosts.map((post) => (
                <Grid.Column key={post.id} style={{ marginBottom: '2rem' }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
};

const FETCH_POSTS_QUERY = gql`
  query {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      commentCount
      likes {
        username
      }
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default Home;
