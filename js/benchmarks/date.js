module.exports = {
	name: 'Now',
	tests: {
		'new Date()': function() {
			var now = new Date();
		},
		'Date.now()': function() {
			var now = Date.now();
		}
	}
}
