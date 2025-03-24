import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

// Define attributes for Message model
interface MessageAttributes {
    id: number;
    text: string;
    userId: number;
}

// Allow optional fields for Sequelize's `create()` method
interface MessageCreationAttributes extends Optional<MessageAttributes, 'id'> {}

// Define the Message model
class Message extends Model<MessageAttributes, MessageCreationAttributes> {
    public id!: number;
    public text!: string;
    public userId!: number;
}

// Initialize Message model
Message.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        text: { type: DataTypes.STRING, allowNull: false },
        userId: { 
            type: DataTypes.INTEGER, 
            allowNull: false, 
            references: { model: User, key: 'id' } 
        },
    },
    { 
        sequelize, 
        modelName: 'Message',
        timestamps: true, // Adds createdAt & updatedAt
    }
);

// Define Relationships
User.hasMany(Message, { foreignKey: 'userId', onDelete: 'CASCADE' });
Message.belongsTo(User, { foreignKey: 'userId' });

export default Message;
