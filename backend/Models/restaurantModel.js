const Restaurant = (sequelize, DataTypes) => {
    const Restaurant = sequelize.define('Restaurant', {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cnpj: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      profile_picture: {
        type: DataTypes.STRING,
        allowNull: true
      },
      default_time_permanence: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 60,
      },
      auto_close_time_permanence: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    }, {
      timestamps: false,
      tableName: 'restaurants'
    });
  
    Restaurant.associate = (models) => {
      Restaurant.hasMany(models.RestaurantOpeningDay, {
        foreignKey: 'restaurant_id'
      });
      Restaurant.hasMany(models.Product, { 
            foreignKey: 'restaurant_id',
        });
      Restaurant.hasMany(models.Table, { 
            foreignKey: 'restaurant_id',
        });
    };
    
  
    return Restaurant;
  };
  
  module.exports = Restaurant;
  