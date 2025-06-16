import Mail from '../models/mailModel.js';
import History from '../models/historyModel.js';

// Update mail status (admin only)
export const updateMailStatus = async (req, res) => {
  try {
    const { mailId } = req.params;
    const { status, alasan } = req.body;

    // Check if mail exists
    const mail = await Mail.findByPk(mailId);
    if (!mail) {
      return res.status(404).json({ message: 'Mail not found' });
    }

    // Create new history record
    const history = await History.create({
      id_surat: mailId,
      status,
      alasan: alasan || null, 
      tanggal_update: new Date() 
    });

    res.json({
      message: `Mail status updated to ${status}`, 
      history
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get mail history
export const getMailHistory = async (req, res) => {
  try {
    const { mailId } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;

    // Check if mail exists and if user is authorized
    const mail = await Mail.findByPk(mailId);
    
    if (!mail) {
      return res.status(404).json({ message: 'Mail not found' });
    }

    // Check if user is authorized to view this mail history
    if (userRole !== 'admin' && mail.id_pengirim !== userId) {
      return res.status(403).json({ message: 'Forbidden: You cannot access this mail history' });
    }

    const history = await History.findAll({
      where: { id_surat: mailId },
      order: [['tanggal_update', 'DESC']]
    });

    res.json({ history });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};