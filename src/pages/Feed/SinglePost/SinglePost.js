import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

const SinglePost = () => {
  const [post, setPost] = useState({});

  const params = useParams();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:8080/feed/post/${params.postId}`);

        if (res.status !== 200) {
          throw new Error('Failed to fetch status');
        }

        const { post } = await res.json();

        setPost({
          title: post.title,
          author: post.creator.name,
          image: `http://localhost:8080/${post.imageUrl}`,
          date: new Date(post.createdAt).toLocaleDateString('en-US'),
          content: post.content
        });
      } catch (e) {
        console.log(e);
      }
    })()
  },[params.postId])


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
