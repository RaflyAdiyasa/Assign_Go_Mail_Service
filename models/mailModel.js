import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Mail = sequelize.define('Mail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_pengirim: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  url_file_surat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject_surat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tanggal_pengiriman: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: false,
  tableName: 'mail'
});

export default Mail;