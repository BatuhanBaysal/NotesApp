import React, { useEffect, useState, useCallback, useMemo } from 'react';
import NoteApiService from '../services/NoteApiService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import NoteEditModal from '../components/NoteEditModal'; 

const MAX_TITLE_LENGTH = 50; 
const MAX_CONTENT_LENGTH = 300;

const NoteForm = ({ 
    title, content, setTitle, setContent, 
    handleCreate, maxTitle, maxContent,
}) => (
    <div className="note-form">
        <h2>Add New Note</h2> 
        <form onSubmit={handleCreate}>
            <input
                type="text"
                placeholder="Note Title"
                value={title} 
                maxLength={maxTitle} 
                onChange={(e) => setTitle(e.target.value)} 
                required
            />

            <textarea
                placeholder="Note Content"
                value={content} 
                maxLength={maxContent}
                onChange={(e) => setContent(e.target.value)} 
                rows="8"
                required
            ></textarea>
            
            <button type="submit" className="btn-save">
                Save Note
            </button>
        </form>
    </div>
);

const NoteControls = ({ 
    filterStatus, setFilterStatus, 
    sortOrder, setSortOrder,
    searchTerm, setSearchTerm
}) => (
    <div className="note-controls">
        <input
            type="text"
            placeholder="Search notes by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
        />

        <label className="control-group">
            Filter:
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Notes</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
            </select>
        </label>

        <label className="control-group">
            Sort By:
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="newest">Date (Newest)</option>
                <option value="oldest">Date (Oldest)</option>
                <option value="titleAsc">Title (A-Z)</option>
                <option value="titleDesc">Title (Z-A)</option>
            </select>
        </label>
    </div>
);

const NoteList = ({ notes, error, handleDelete, handleToggleCompleted, startEdit }) => (
    <div className="note-list">
        <h2>Note List ({notes.length} Note)</h2>
        
        {error && <p className="error-message">{error}</p>} 
        
        <div className="note-list-cards">
            {notes.map(note => (
                <div 
                    key={note.id} 
                    className={`note-card ${note.completed ? 'completed-note' : 'pending-note'}`}
                >
                    <h3>{note.title}</h3>
                    <p className="note-content">{note.content}</p>
                    <p className="note-meta">
                        ID: {note.id} | Creation: {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                    <p className="note-status">Status: {note.completed ? 'Completed' : 'Pending'}</p>

                    <div className="note-actions">
                        <button 
                            className="btn-edit" 
                            onClick={() => startEdit(note)} 
                        >
                            Edit
                        </button>
                        
                        <button 
                            className={`status-toggle-button ${note.completed ? 'btn-pending' : 'btn-done'}`}
                            onClick={() => handleToggleCompleted(note)}
                        >
                            {note.completed ? 'Mark as Pending' : 'Mark as Completed'} 
                        </button>
                        <button 
                            className="btn-delete"
                            onClick={() => handleDelete(note.id)} 
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const NoteSkeletonLoader = () => (
    <div className="note-list-cards">
        {[...Array(3)].map((_, index) => ( 
            <div key={index} className="note-card skeleton-card">
                <div className="skeleton-line skeleton-title"></div>
                <div className="skeleton-line skeleton-content-1"></div>
                <div className="skeleton-line skeleton-content-2"></div>
                <div className="skeleton-line skeleton-meta"></div>
                <div className="skeleton-actions">
                    <div className="skeleton-button"></div>
                    <div className="skeleton-button"></div>
                </div>
            </div>
        ))}
    </div>
);

function HomePage({ setTotalNoteCount }) {
    const { token } = useAuth(); 
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); 
    const [sortOrder, setSortOrder] = useState('newest');
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(''); 
    const [noteToEdit, setNoteToEdit] = useState(null); 

    const fetchNotes = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await NoteApiService.getAllNotes();
            setNotes(response.data);
            if (setTotalNoteCount) {
                setTotalNoteCount(response.data.length);
            }
            setError('');
        } catch (err) {
            console.error("Error loading notes:", err);
            
            if (err.response && err.response.status !== 401 && err.response.status !== 403) {
                 setError("Error: There was a problem while loading notes. Check network."); 
            } else if (!err.response) {
                 setError("Network Error: Could not connect to the API server."); 
            }
        } finally {
            setLoading(false);
        }
    }, [token, setTotalNoteCount]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const handleCreate = async (e) => {
        e.preventDefault();
        
        if (!title.trim() || !content.trim()) {
            toast.error("Title and content cannot be empty."); 
            return;
        }

        if (title.length > MAX_TITLE_LENGTH) {
             toast.error(`Title is too long! Max ${MAX_TITLE_LENGTH} characters.`);
             return;
        }
        if (content.length > MAX_CONTENT_LENGTH) {
             toast.error(`Content is too long! Max ${MAX_CONTENT_LENGTH} characters.`);
             return;
        }

        setError(''); 
        try {
            const newNote = { title, content, completed: false };
            await NoteApiService.createNote(newNote); 
        
            setTitle('');
            setContent('');
            fetchNotes(); 
        } catch (e) {
             
        }
    };

    const handleDelete = async (id) => {
        try {
            await NoteApiService.deleteNote(id); 
            fetchNotes();
        } catch (e) {

        }
    };

    const handleToggleCompleted = async (note) => {
        setError('');
        try {
           const updatedNote = { ...note, completed: !note.completed };
            await NoteApiService.updateNote(note.id, updatedNote);
            fetchNotes();
            toast.info(`Note status updated to: ${updatedNote.completed ? 'Completed' : 'Pending'}`); 
        } catch (e) {

        }
    };

    const startEdit = useCallback((note) => {
        setNoteToEdit(note); 
        toast.info(`Editing note: "${note.title}" via Modal.`);
    }, []);

    const closeModal = useCallback(() => {
        setNoteToEdit(null);
    }, []);

    
    const getFilteredAndSortedNotes = useMemo(() => {
        let currentNotes = [...notes]; 

        if (searchTerm) {
            const lowercasedSearch = searchTerm.toLowerCase();
            currentNotes = currentNotes.filter(note => 
                note.title.toLowerCase().includes(lowercasedSearch) ||
                note.content.toLowerCase().includes(lowercasedSearch)
            );
        }

        currentNotes = currentNotes.filter(note => {
            if (filterStatus === 'pending') return !note.completed;
            if (filterStatus === 'completed') return note.completed;
            return true; 
        });

        return currentNotes.sort((a, b) => {
            if (sortOrder === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            if (sortOrder === 'oldest') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
            if (sortOrder === 'titleAsc') {
                return a.title.localeCompare(b.title);
            }
            if (sortOrder === 'titleDesc') {
                return b.title.localeCompare(a.title);
            }
            return 0;
        });
    }, [notes, filterStatus, sortOrder, searchTerm]);

    return (
        <div className="note-app-container">
            <div className="main-content">
                <div className="left-panel">
                    <NoteForm 
                        title={title}
                        content={content}
                        setTitle={setTitle}
                        setContent={setContent}
                        handleCreate={handleCreate}
                        maxTitle={MAX_TITLE_LENGTH} 
                        maxContent={MAX_CONTENT_LENGTH}
                    />
                </div>
                <div className="right-panel">
                    <NoteControls 
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                    
                    {loading ? (
                        <NoteSkeletonLoader />
                    ) : (
                        <NoteList 
                            notes={getFilteredAndSortedNotes}
                            error={error} 
                            handleDelete={handleDelete} 
                            handleToggleCompleted={handleToggleCompleted}
                            startEdit={startEdit}
                        />
                    )}
                </div>
            </div>

            <NoteEditModal 
                note={noteToEdit} 
                onClose={closeModal} 
                onUpdateSuccess={fetchNotes} 
            />
        </div>
    );
}

export default HomePage;