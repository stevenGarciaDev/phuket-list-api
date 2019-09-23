const { User } = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user.generateAuthToken()', () => {
	it('should return a valid JWT', () => {

		// Payload data
		const payload = {
			_id: new mongoose.Types.ObjectId().toHexString(),
		    name: 'John Doe',
		    email: 'johndoe@email.com',
		    isAdmin: true,
		    isActiveAccount: true,
		    isPrivateProfile: false
		};

		// Create object with payload for test
		const user = new User(payload);

		// Call function to generate using object
		const token = user.generateAuthToken();

		// Verify token
		const decoded = jwt.verify(token, config.get('jwtPrivateKey'))

		// Establish what is to be expected
		expect(decoded).toMatchObject(payload);
	});

});