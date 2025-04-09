
const RestaurantOpeningDay = (sequelize, DataTypes) => {
    const OpeningDay = sequelize.define('RestaurantOpeningDay', {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      restaurant_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      day_of_week: {
        type: DataTypes.ENUM('Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo'),
        allowNull: false
      },
      open_time: {
        type: DataTypes.TIME,
        allowNull: false
      },
      close_time: {
        type: DataTypes.TIME,
        allowNull: false
      }
    }, {
      timestamps: true,
      tableName: 'restaurant_opening_days'
    });
  
    OpeningDay.associate = models => {
      OpeningDay.belongsTo(models.Restaurant, {
        foreignKey: 'restaurant_id',
        as: 'restaurant'
      });
    };
  
    return OpeningDay;
  };
  
  module.exports = RestaurantOpeningDay;
  