const { Post } = require('../../../models/post');
const mongoose = require('mongoose');
const Joi = require('Joi');
Joi.objectId = require('joi-objectid')(Joi);

describe('post.validate()', () => {
	it('should return true if post has valid content', () => {

		// Payload data
		const payload = {
			text: "Lorem ipsum",
		    image: "image.png",
		    topicID: new mongoose.Types.ObjectId().toHexString()
		};

		// Create object with payload for test
		const post = new Post(payload);

		// Verify object
		const validate = post.validate(post);

		// Establish expectation
		expect(validate).toBeTruthy();
	});
});
