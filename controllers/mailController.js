import Mail from '../models/mailModel.js';
import History from '../models/historyModel.js';
import { Op } from 'sequelize';
import sequelize from '../config/db.js';
import multer from 'multer';
import { uploadFile } from '../utils/Storage.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single('file_surat');

// Submit a new mail (user only)
export const submitMail = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ message: 'File upload error', error: err.message });
      }

      const { subject_surat } = req.body;
      const userId = req.userId;

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Upload file to cloud storage
      const fileUrl = await uploadFile(req.file);

      const mail = await Mail.create({
        id_pengirim: userId,
        url_file_surat: fileUrl,
        subject_surat,
        tanggal_pengiriman: new Date()
      });

      // Create initial history record with 'diproses' status
      await History.create({
        id_surat: mail.id,
        status: 'diproses',
        tanggal_update: new Date()
      });

      res.status(201).json({
        message: 'Mail submitted successfully',
        mail
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
};


// Get all mails (admin only)
export const getAllMails = async (req, res) => {
  try {
    const mails = await Mail.findAll({
      include: [
        {
          model: History,
          attributes: ['id', 'status', 'alasan', 'tanggal_update'],
          order: [['tanggal_update', 'DESC']],
          limit: 1
        }
      ],
      order: [['tanggal_pengiriman', 'DESC']]
    });

    // Process data to get latest status for each mail
    const processedMails = mails.map(mail => {
      const plainMail = mail.get({ plain: true });
      const latestHistory = plainMail.Histories[0] || { status: 'diproses' };
      
      return {
        ...plainMail,
        latestStatus: latestHistory.status,
        alasan: latestHistory.alasan,
        tanggal_update: latestHistory.tanggal_update,
        Histories: undefined
      };
    });

    res.json({ mails: processedMails });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get mails by user ID
export const getMailsByUser = async (req, res) => {
  try {
    const userId = req.userId;

    const mails = await Mail.findAll({
      where: { id_pengirim: userId },
      include: [
        {
          model: History,
          attributes: ['id', 'status', 'alasan', 'tanggal_update'],
          order: [['tanggal_update', 'DESC']],
          limit: 1
        }
      ],
      order: [['tanggal_pengiriman', 'DESC']]
    });

    // Process data to get latest status for each mail
    const processedMails = mails.map(mail => {
      const plainMail = mail.get({ plain: true });
      const latestHistory = plainMail.Histories[0] || { status: 'diproses' };
      
      return {
        ...plainMail,
        latestStatus: latestHistory.status,
        alasan: latestHistory.alasan,
        tanggal_update: latestHistory.tanggal_update,
        Histories: undefined
      };
    });

    res.json({ mails: processedMails });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get mail details
export const getMailDetails = async (req, res) => {
  try {
    const { mailId } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;

    const mail = await Mail.findByPk(mailId, {
      include: [
        {
          model: History,
          attributes: ['id', 'status', 'alasan', 'tanggal_update'],
          order: [['tanggal_update', 'DESC']]
        }
      ]
    });

    if (!mail) {
      return res.status(404).json({ message: 'Mail not found' });
    }

    // Check if user is authorized to view this mail
    if (userRole !== 'admin' && mail.id_pengirim !== userId) {
      return res.status(403).json({ message: 'Forbidden: You cannot access this mail' });
    }

    res.json({ mail });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get mail statistics (admin only)
export const getMailStats = async (req, res) => {
  try {
    // Get total mails
    const totalMails = await Mail.count();

    // Get mails by status
    const mailsByStatus = await History.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Get monthly submissions for the last 6 months
    const date = new Date();
    date.setMonth(date.getMonth() - 5);
    
    const monthlyStats = [];
    
    for (let i = 0; i < 6; i++) {
      const month = date.getMonth() + i;
      const year = date.getFullYear() + Math.floor((date.getMonth() + i) / 12);
      const startDate = new Date(year, month % 12, 1);
      const endDate = new Date(year, (month + 1) % 12, 1);
      
      const count = await Mail.count({
        where: {
          tanggal_pengiriman: {
            [Op.gte]: startDate,
            [Op.lt]: endDate
          }
        }
      });
      
      monthlyStats.push({
        month: startDate.toLocaleString('default', { month: 'long' }),
        year: year,
        count: count
      });
    }

    res.json({
      totalMails,
      mailsByStatus,
      monthlyStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get template for surat tugas
export const getMailTemplate = async (req, res) => {
  try {
    // URL template surat tugas (bisa berupa file statis atau generate dinamis)
    const templateUrl = "https://example.com/template_surat_tugas.docx";
    
    res.json({
      message: 'Template retrieved successfully',
      templateUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};