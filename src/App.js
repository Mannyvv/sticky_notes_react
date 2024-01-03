import './App.css'
import { useEffect, useState } from 'react';
import { dummyData } from './dummyData';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState(null)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/notes")
        const notes = await response.json()
        setNotes(notes)
      } catch (error) {
        console.log(error)
      }
    }
    fetchNotes()
  }, [])


  const handleNewNote = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          content
        })
      })
      const newNote = await response.json()
      setNotes([newNote, ...notes])
      setTitle("")
      setContent("")
    } catch (error) {
      console.log(error)
    }


  }

  const handleNoteclick = (note) => {
    setSelectedNote(note)
    setTitle(note.title)
    setContent(note.content)
  }

  const handleUpdateNote = async (event) => {
    event.preventDefault();
    if (!selectedNote) {
      return;
    }

    // const updatedNote = {
    //   id: selectedNote.id,
    //   title: title,
    //   content: content
    // }
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${selectedNote.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          content,
        })
      })
      const updatedNote = await response.json()
      const updateNoteList = notes.map((note) =>
        note.id === selectedNote.id ? updatedNote : note
      )
      setNotes(updateNoteList);
      setSelectedNote(null);
      setTitle("")
      setContent("")
    } catch (error) {
      console.log(error)
    }


    // Map through each item and will return updated note for matching id, only
    // will return same note for all others
  }

  const handleCancel = () => {
    setTitle("")
    setContent("")
    setSelectedNote(null)
  }

  const deleteNote = async (event, note) => {
    event.stopPropagation();

    try {

      await fetch(`http://localhost:5000/api/notes/${note.id}`,{
        method: "DELETE",
      })
      
      const selectedNote = note
      const updateNoteList = notes.filter((note) => note.id !== selectedNote.id)
  
      setNotes(updateNoteList);
      setSelectedNote(null);
      
    } catch (error) {
      
    }
  }

  return (
    <div className='app-container'>
      <form className='note-form' onSubmit={selectedNote ? handleUpdateNote : handleNewNote}>
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
            <div className='note-item' onClick={() => handleNoteclick(note)} key={note.id}>
              <div className='notes-header'>
                <button onClick={(event) => deleteNote(event, note)}>x</button>
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