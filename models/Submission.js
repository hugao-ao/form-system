import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  summary: {
    type: String,
    required: false,
  },
  suggestedDocuments: {
    type: [String],
    default: [],
  }
});

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
