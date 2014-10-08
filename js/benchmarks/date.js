module.exports = {
	name: 'Now',
	tests: {
		'new Date()': function() {
			var now = new Date();
		},
		'Date.now()': function() {
			/* IE8 does not have Date.now() */
			var now = ('now' in Date) ? Date.now() : new Date();
		}
	}
}
