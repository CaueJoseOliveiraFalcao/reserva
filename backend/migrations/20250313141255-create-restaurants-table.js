'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('restaurants', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      cnpj: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
    },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      profile_picture: {
        type: Sequelize.STRING,
        allowNull: true
      },
      segunda: {
        type : Sequelize.BOOLEAN,
        allowNull : false,
        defaultValue : false
      },
      terca: {
          type : Sequelize.BOOLEAN,
          allowNull : false,
          defaultValue : false
      },
      quarta: {
          type : Sequelize.BOOLEAN,
          allowNull : false,
          defaultValue : false
      },
      quinta: {
          type : Sequelize.BOOLEAN,
          allowNull : false,
          defaultValue : false
      },
      sexta: {
          type : Sequelize.BOOLEAN,
          allowNull : false,
          defaultValue : false
      },
      sabado: {
          type : Sequelize.BOOLEAN,
          allowNull : false,
          defaultValue : false
      },
      domingo: {
          type : Sequelize.BOOLEAN,
          allowNull : false,
          defaultValue : false
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('restaurants');
  }
};
