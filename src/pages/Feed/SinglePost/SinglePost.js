import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

const SinglePost = ({ token }) => {
  const [post, setPost] = useState({});

  const params = useParams();

  useEffect(() => {
    (async () => {
      try {
        const graphqlQuery = {
          query: `
            query GetPost($id: ID!) {
              post(id: $id) {
                title
                content
                imageUrl
                creator {
                  name
                }
                createdAt
              }
            }
          `,
          variables: {
            id: params.postId
          }
        }

        const res = await fetch(`http://localhost:8080/graphql`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(graphqlQuery)
        });

        const result = await res.json();

        if (result.errors) {
          throw new Error('Fetching post failed');
        }

        const { title, creator, imageUrl, createdAt, content } = result.data.post;

        setPost({
          title,
          author: creator.name,
          image: `http://localhost:8080/${imageUrl}`,
          date: new Date(createdAt).toLocaleDateString('en-US'),
          content
        });
      } catch (e) {
        console.log(e);
      }
    })()
  },[params.postId, token])


  return (
    <section className="single-post">
      <h1>{post.title}</h1>
      <h2>
        Created by {post.author} on {post.date}
      </h2>
      <div className="single-post__image">
        <Image contain imageUrl={post.image} />
      </div>
      <p>{post.content}</p>
    </section>
  );
}

export default SinglePost;
