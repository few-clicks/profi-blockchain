import { useState, useEffect } from 'react';

import { Grid } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Post from './components/Post';

// ----------------------------------------------------------------------

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export default function NewsView() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/news`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setPosts(data.data);
      })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Crypto News
      </Typography>

      <Container sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {posts.length > 0 &&
            posts.map((post, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Post post={post} />
              </Grid>
            ))}
        </Grid>
      </Container>
    </Container>
  );
}
