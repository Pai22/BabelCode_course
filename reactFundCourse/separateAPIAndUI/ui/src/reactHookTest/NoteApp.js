import React, { useState } from 'react'

import NoteList from './NoteList'
import NoteForm from './NoteForm'
import styles from './NoteApp.module.css' //มี .module เพื่อจัด styles ใน component นั้นๆ

export default function NoteApp() {
  const [notes, setNotes] = useState([])
  return (
    <div className={styles.wrapper}>
      <NoteForm notes={notes} setNotes={setNotes} />
      <NoteList notes={notes} setNotes={setNotes} />
    </div>
  )
}
