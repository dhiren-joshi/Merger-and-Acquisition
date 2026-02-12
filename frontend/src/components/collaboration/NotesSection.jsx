import { useState } from 'react';
import { toast } from 'react-toastify';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';
import dealService from '../../services/dealService';

export default function NotesSection({ deal, onUpdate }) {
    const [noteContent, setNoteContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!noteContent.trim()) {
            toast.error('Note content cannot be empty');
            return;
        }

        try {
            setSubmitting(true);
            await dealService.addNote(deal._id, { content: noteContent });
            toast.success('Note added successfully');
            setNoteContent('');
            onUpdate(); // Refresh deal data
        } catch (error) {
            toast.error('Failed to add note');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (noteId) => {
        if (!window.confirm('Are you sure you want to delete this note?')) {
            return;
        }

        try {
            await dealService.deleteNote(deal._id, noteId);
            toast.success('Note deleted successfully');
            onUpdate();
        } catch (error) {
            toast.error('Failed to delete note');
        }
    };

    const notes = deal.notes || [];

    return (
        <div className="card">
            <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="w-6 h-6 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Notes & Comments</h3>
                <span className="text-sm text-gray-500">({notes.length})</span>
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleSubmit} className="mb-6">
                <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Add a note or comment..."
                    className="input resize-none"
                    rows="4"
                    disabled={submitting}
                />
                <div className="flex justify-end mt-2">
                    <button
                        type="submit"
                        disabled={submitting || !noteContent.trim()}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <Send className="w-4 h-4" />
                        <span>{submitting ? 'Posting...' : 'Post Note'}</span>
                    </button>
                </div>
            </form>

            {/* Notes List */}
            {notes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>No notes yet. Be the first to add one!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notes.map((note) => (
                        <div
                            key={note._id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm">
                                        {note.createdBy?.firstName?.[0]}{note.createdBy?.lastName?.[0]}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {note.createdBy?.firstName} {note.createdBy?.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatRelativeTime(note.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(note._id)}
                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                    title="Delete note"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
