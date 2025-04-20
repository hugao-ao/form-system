import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Por favor, forneça o conteúdo da observação'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
