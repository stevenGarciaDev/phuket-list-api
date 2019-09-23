const { ListItem } = require('../../../models/listItem');
const mongoose = require('mongoose');
const Joi = require('Joi');
Joi.objectId = require('joi-objectid')(Joi);

describe('post.validate()', () => {
	it('should return true if list item has valid content', () => {
		
		// Payload data
		const payload = {
			taskName: "Lorem Ipsum",
    		isCompleted: false
		};

		// Create object with payload for test
		const listItem = new ListItem(payload);

		// Verify object
		const validate = listItem.validate(listItem);

		// Establish expectation
		expect(validate).toBeTruthy();
	});
});