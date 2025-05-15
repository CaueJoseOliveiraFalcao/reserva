// models/Table.js
module.exports = (sequelize, DataTypes) => {
    const Table = sequelize.define('Table', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      restaurant_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      table_number: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      table_capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'tables',
      timestamps: false
    });
  
    Table.associate = (models) => {
      Table.belongsTo(models.Restaurant, {
        foreignKey: 'restaurant_id',
      });
        Table.hasOne(models.Reservation, {
          foreignKey: 'table_id',
        });
    };
  
    return Table;
  };
  