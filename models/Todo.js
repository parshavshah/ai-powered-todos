"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Todo extends Model {
        static associate(models) { }
    }
    Todo.init(
        {
            title: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Todo",
        }
    ).sync({ force: true });
    return Todo;
};