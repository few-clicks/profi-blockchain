import React from 'react';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

const truncateDescription = (description, wordLimit) => {
  const words = description.split(' ');
  if (words.length > wordLimit) {
    return `${words.slice(0, wordLimit).join(' ')}...`;
  }
  return description;
};

const Post = ({ post }) => {
  const formattedDate = new Date(post.updated_at * 1000).toLocaleDateString();

  return (
    <Card>
      <CardMedia component="img" height="140" image={post.thumb_2x} alt={post.title} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {truncateDescription(post.title, 10)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {truncateDescription(post.description, 20)}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Author: {post.author}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Date: {formattedDate}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          <Link href={post.url} target="_blank" rel="noopener" underline="none">
            Read More
          </Link>
        </Button>
      </CardActions>
    </Card>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    updated_at: PropTypes.number.isRequired,
    news_site: PropTypes.string,
    thumb_2x: PropTypes.string.isRequired,
  }).isRequired,
};

export default Post;
