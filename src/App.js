import './App.css'
import { useState } from 'react';
import { dummyData } from './dummyData';

const App = () => {
  const [notes, setNotes] = useState(dummyData);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState(null)

  const handleAddNote = (event) => {
    event.preventDefault();
    console.log("Title: ", title)
    console.log("Content: ", content)

    const newNote = {
      id: notes.length + 1,
      title: title,
      content: content
    }

    setNotes([newNote, ...notes])
    setTitle("")
    setContent("")
  }

  const handleNoteclick = (note) => {
    setSelectedNote(note)
    setTitle(note.title)
    setContent(note.content)
  }

  const handleUpdateNote = (event) => {
    event.preventDefault();
    if (!selectedNote) {
      return;
    }

    const updatedNote = {
      id: selectedNote.id,
      title: title,
      content: content
    }

    // Map through each item and will return updated note for matching id, only
    // will return same note for all others
    const updateNoteList = notes.map((note) =>
      note.id === selectedNote.id ? updatedNote : note
    )
    setNotes(updateNoteList);
    setSelectedNote(null);
    setTitle("")
    setContent("")
  }

  const handleCancel = () => {
    setTitle("")
    setContent("")
    setSelectedNote(null)
  }

  const deleteNote = (event,note) => {
    event.stopPropagation();
    const selectedNote = note
    const updateNoteList = notes.filter((note) => note.id != selectedNote.id)
      setNotes(updateNoteList);
      setSelectedNote(null);
    }

  return (
    <div className='app-container'>
      <form className='note-form' onSubmit={selectedNote ? handleUpdateNote : handleAddNote}>
        <input placeholder='Title' value={title} onChange={(event) => setTitle(event.target.value)} required />
        <textarea placeholder='Content' rows={10} value={content} onChange={(event) => setContent(event.target.value)} required />
        {selectedNote ? (
          <div className='edit-buttons'>
            <button type='submit'>Save</button>
            <button onClick={handleCancel}>Cancel</button>

          </div>) : (<button type='submit' >Add Note</button>)}
      </form>

      <div className='notes-grid'>
        {notes.map((note) => {
          return (
            <div className='note-item' onClick={() => handleNoteclick(note)}  key={note.id}>
              <div className='notes-header'>
                <button onClick={(event) => deleteNote(event,note)}>x</button>
              </div>
              <h2>{note.title}</h2>
              <p >{note.content}</p>
            </div>
          )
        })}
      </div>
    </div>
  )

}

export default App;