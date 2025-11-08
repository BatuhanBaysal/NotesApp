import React, { useState, useEffect } from 'react';
import NoteApiService from '../services/NoteApiService';
import { toast } from 'react-toastify';

const MAX_TITLE_LENGTH = 50; 
const MAX_CONTENT_LENGTH = 300; 

const NoteEditModal = ({ note, onClose, onUpdateSuccess }) => {
    if (!note) return null; 

    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTitle(note.title);
        setContent(note.content);
    }, [note]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!title.trim() || !content.trim()) {
            toast.error("Title and content cannot be empty.");
            setLoading(false);
            return;
        }

        if (title.length > MAX_TITLE_LENGTH || content.length > MAX_CONTENT_LENGTH) {
            toast.error("Title or content exceeds max length.");
            setLoading(false);
            return;
        }

        try {
            const updatedNoteData = { title, content, completed: note.completed };
            await NoteApiService.updateNote(note.id, updatedNoteData);

            toast.success(`Note "${title}" updated successfully!`);
            onUpdateSuccess();
            onClose(); 
        } catch (e) {
            console.error("Update failed:", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                
                <h2>Edit Note: {note.title}</h2>
                <form onSubmit={handleUpdate} className="note-form">
                    <input
                        type="text"
                        placeholder="Note Title"
                        value={title} 
                        maxLength={MAX_TITLE_LENGTH} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required
                        disabled={loading}
                    />
                    <textarea
                        placeholder="Note Content"
                        value={content} 
                        maxLength={MAX_CONTENT_LENGTH}
                        onChange={(e) => setContent(e.target.value)} 
                        rows="8"
                        required
                        disabled={loading}
                    ></textarea>
                    
                    <div className="modal-actions-group"> 
                        <button type="submit" className="btn-save" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'} 
                        </button>
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="btn-cancel"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NoteEditModal;