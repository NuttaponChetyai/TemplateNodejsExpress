const mongoose = require('mongoose');
require('mongoose-type-email');

/**
* User
*/

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String , required: true},
	 name: { type: String , required: true},
	 lastname : { type: String , required: true},
    email: { type: mongoose.SchemaTypes.Email, required: true }
}, { versionKey: false, collection: 'users' }
);

userSchema.index({ username: 1, password: 1 });
userSchema.index({ email: 1 });

/**
 * @typedef User
 */
module.exports = mongoose.model('users', userSchema);
