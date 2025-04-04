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
        segunda: {
            type : DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue : false
        },
        terca: {
            type : DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue : false
        },
        quarta: {
            type : DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue : false
        },
        quinta: {
            type : DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue : false
        },
        sexta: {
            type : DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue : false
        },
        sabado: {
            type : DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue : false
        },
        domingo: {
            type : DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue : false
        },
    }, {
        timestamps: true,
        tableName: 'restaurants'
    });
};
module.exports = Restaurant;
