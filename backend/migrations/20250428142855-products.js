'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id : {
        type : Sequelize.BIGINT.UNSIGNED,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true,
      },
      restaurant_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
            model: 'restaurants',
            key: 'id',
        },
      },
      name : {
        type : Sequelize.STRING,
        allowNull : false,
      },
      description : {
        type : Sequelize.STRING,
        allowNull : true
      },
      price : {
        type : Sequelize.DECIMAL(10, 2),
        allowNull : false,
      },
      createdAt : {
        type : Sequelize.DATE,
        allowNull : false ,
        defaultValue : Sequelize.DataTypes.NOW
      },
      updatedAt : {
        type : Sequelize.DATE,
        allowNull : false ,
        defaultValue : Sequelize.DataTypes.NOW
      },
      }
    )
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('products');
  }
};
