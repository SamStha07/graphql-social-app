import React from 'react';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Grid, Image } from 'semantic-ui-react';
import PostCard from '../Components/PostCard';

const Home = () => {
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  return (
    <Grid columns={3}>
      <Grid.Row className='page-title'>Recent Posts</Grid.Row>

      <Grid.Row>
        {loading ? (
          <p>Loading</p>
        ) : (
          <>
            {data &&
              data.getPosts &&
              data.getPosts.map((post) => (
                <Grid.Column style={{ marginBottom: '2rem' }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </>
        )}
      </Grid.Row>
    </Grid>
  );
};

const FETCH_POSTS_QUERY = gql`
  {
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
