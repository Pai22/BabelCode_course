import React from 'react'

import useFetch from './useFetch'

export default function PostList() {
  const { data: posts, isLoading } = useFetch('/posts')

  if (isLoading) return <div>Loading...</div>

  return (
    <>
      <ul>
        {posts.map((posts) => (
          <li key={posts.id}>{posts.title}</li>
        ))}
      </ul>
    </>
  )
}
