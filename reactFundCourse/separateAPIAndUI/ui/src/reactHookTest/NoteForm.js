import React, { useState } from 'react'
import axios from 'axios'

import styles from './NoteForm.module.css' //มี .module เพื่อจัด styles ใน component นั้นๆ

export default function NoteForm({ notes, setNotes }) {
  const [note, setNote] = useState('')

  const changeNote = (event) => setNote(event.target.value)

  const createNote = async () => {
    const { data } = await axios.post('/notes', { body: note })

    setNotes([...notes, data])
    setNote('')
  }

  return (
    <div className={styles['note-form']}>
      <input
        type="text"
        onChange={changeNote}
        value={note}
        className={styles['note-form-input']}
      />
      <button onClick={createNote} className={styles['note-form-submit']}>
        Add Note
      </button>
    </div>
  )
}
