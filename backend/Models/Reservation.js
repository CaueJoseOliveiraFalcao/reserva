const Reservation = (sequelize, DataTypes) => {
    const Reservation = sequelize.define('Reservation', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        restaurant_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        client_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        table_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        date_reservation : {
            type : DataTypes.DATE,
            allowNull : false,
        },
        begin : {
            type : DataTypes.TIME,
            allowNull : false,
        },
        end : {
            type : DataTypes.TIME,
            allowNull : false,
        },
        status : {
            type : DataTypes.ENUM('pendente', 'aberto', 'fechado'),
            allowNull : false,
            defaultValue : 'pendente',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'reservations',
        timestamps: true,
    });
    
    Reservation.associate = (models) => {
        Reservation.belongsTo(models.Restaurant, {
            foreignKey: 'restaurant_id',
        });
        Reservation.belongsTo(models.Users, {
            foreignKey: 'client_id',
        });
        Reservation.belongsTo(models.Table, {
            foreignKey: 'table_id',
        });
    };

    return Reservation; 
}


module.exports = Reservation;