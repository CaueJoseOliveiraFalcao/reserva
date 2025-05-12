const Reservation = (sequelize, DataTypes) => {
    const Reservation = sequelize.define('Reservation', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        restaurant_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        client_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        table_id: {
            type: DataTypes.INTEGER,
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
            as: 'restaurant',
        });
        Reservation.belongsTo(models.User, {
            foreignKey: 'client_id',
        });
        Reservation.belongsTo(models.Table, {
            foreignKey: 'table_id',
        });
    };

    return Reservation; 
}


module.exports = Reservation;