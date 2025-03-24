import { Sequelize } from 'sequelize';

const sequelize = new Sequelize("chat-app", "root", "Omer@2006", {
    host: "localhost",
    dialect: "mysql"
});

export default sequelize;
