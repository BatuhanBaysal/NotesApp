import React, { useState } from 'react';
import NoteApiService from '../services/NoteApiService';

function NoteForm({ onNoteCreated }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError("The title cannot be left blank."); 
            return;
        }

        const newNote = { title, content, completed: false };

        NoteApiService.createNote(newNote)
            .then(response => {
                setTitle('');
                setContent('');
                onNoteCreated(); 
            })
            .catch(err => {
                console.error("Note could not be created:", err);
                setError("An error occurred during note creation."); 
            });
    };

    return (
        <form onSubmit={handleSubmit} className="note-form">
            <h2>Add New Note</h2>
            
            {error && (
                <p 
                    className="error-message" 
                    style={{marginBottom: '0', marginTop: '0', padding: '10px', border: 'none', backgroundColor: 'transparent', color: 'red'}}
                >
                    {error}
                </p>
            )}
            
            <input
                type="text"
                placeholder="Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Note Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            
            <button type="submit" className="btn-save">Save Note</button>
        </form>
    );
}

export default NoteForm;