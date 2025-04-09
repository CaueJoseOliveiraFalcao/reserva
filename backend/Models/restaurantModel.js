const Restaurant = (sequelize, DataTypes) => {
    return sequelize.define('Restaurant', {
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
    }, {
        timestamps: true,
        tableName: 'restaurants'
    });
};

Restaurant.associate = models => {
    Restaurant.hasMany(models.RestaurantOpeningDay , {
        foreingKey : 'restaurant_id',
        as : 'opening_days'
    });
};
module.exports = Restaurant;
