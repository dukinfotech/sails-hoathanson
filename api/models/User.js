module.exports = {
  tableName: 'users',
  attributes: {
    name: {
      type: 'string',
      required: true,
      maxLength: 120,
      minLength: 6,
    },
    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
    },
    password: {
      type: 'string',
      required: true,
      protect: true,
    },
    isSuperAdmin: {
      type: 'boolean',
      defaultsTo: false
    },
    createdAt: { type: 'number', autoCreatedAt: true, },
    updatedAt: { type: 'number', autoUpdatedAt: true, },
  },
};
