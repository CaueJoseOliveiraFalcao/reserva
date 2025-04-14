'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('restaurant_opening_days' , {
      id : {
        type : Sequelize.BIGINT.UNSIGNED,
        autoIncrement : true,
        primaryKey : true,
        allowNull : false,
      },
      restaurant_id : {
        type : Sequelize.BIGINT.UNSIGNED,
        allowNull : false,
        references : {
          model : 'restaurants',
          key : 'id',
        },
        onUpdate : 'CASCADE',
        onDelete : 'CASCADE'
      },      
      day_of_week: {
        type: Sequelize.ENUM('Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo'),
        allowNull: false
      },
      open_time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      close_time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('restaurant_opening_days');
  }
};
