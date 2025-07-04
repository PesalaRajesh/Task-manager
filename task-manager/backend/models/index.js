// models/index.js
const User = require('./User');
const Task = require('./Task');

// Define associations
User.hasMany(Task, { foreignKey: 'user_id' });
Task.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { User, Task };
