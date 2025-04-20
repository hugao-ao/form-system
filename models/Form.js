import mongoose from 'mongoose';

const FormSchema = new mongoose.Schema({
  uniqueId: {
    type: String,
    required: [true, 'Por favor, forneça um ID único'],
    unique: true,
    trim: true,
  },
  clientName: {
    type: String,
    required: [true, 'Por favor, forneça o nome do cliente'],
    trim: true,
  },
  clientEmail: {
    type: String,
    required: false,
    lowercase: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'expired'],
    default: 'pending',
  },
  used: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

export default mongoose.models.Form || mongoose.model('Form', FormSchema);
