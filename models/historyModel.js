import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Mail from './mailModel.js';

const History = sequelize.define('History', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_surat: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('diproses', 'disetujui', 'ditolak'),
    defaultValue: 'diproses',
  },
  alasan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tanggal_update: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: false,
  tableName: 'history'
});

// Define relationships
Mail.hasMany(History, {
  foreignKey: 'id_surat',
  sourceKey: 'id'
});

History.belongsTo(Mail, {
  foreignKey: 'id_surat',
  targetKey: 'id'
});

export default History;