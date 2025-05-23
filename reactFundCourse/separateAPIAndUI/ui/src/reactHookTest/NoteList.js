import React, { useEffect } from 'react'
import axios from 'axios'

import styles from './NoteList.module.css' //มี .module เพื่อจัด styles ใน component นั้นๆ

export default function NoteList({ notes, setNotes }) {
  useEffect(() => {
    const fetchNotes = async () => {
      const { data } = await axios.get('/notes')
      setNotes(data)
    }
    fetchNotes()
  }, [setNotes])

  return (
    <>
      <ul className={styles['note-list']}>
        {notes.map((note) => (
          <li className={styles['note-list-item']} key={note.id}>
            {note.body}
          </li>
        ))}
      </ul>
    </>
  )
}
