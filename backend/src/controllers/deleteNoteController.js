/**
 * Delete note from deal
 * DELETE /api/deals/:dealId/notes/:noteId
 */
export const deleteNote = async (req, res) => {
    try {
        const { dealId, noteId } = req.params;

        const deal = await Deal.findById(dealId);

        if (!deal) {
            return res.status(404).json({
                status: 'error',
                message: 'Deal not found'
            });
        }

        // Find the note
        const noteIndex = deal.notes.findIndex(
            note => note._id.toString() === noteId
        );

        if (noteIndex === -1) {
            return res.status(404).json({
                status: 'error',
                message: 'Note not found'
            });
        }

        // Check if user owns the note or is admin
        if (deal.notes[noteIndex].createdBy.toString() !== req.userId) {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to delete this note'
            });
        }

        // Remove the note
        deal.notes.splice(noteIndex, 1);
        await deal.save();

        const populatedDeal = await Deal.findById(deal._id)
            .populate('notes.createdBy', 'firstName lastName');

        res.status(200).json({
            status: 'success',
            data: { deal: populatedDeal }
        });
    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error deleting note'
        });
    }
};
