import React from 'react'
import useFetch from './useFetch'

export default function UserList() {
  const { data: users, isLoading } = useFetch('/users')

  if (isLoading) return <div>Loading...</div>

  return (
    <>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </>
  )
}
