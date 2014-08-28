module.exports = {
	name: 'Math floor',
	tests: {
		'Math.floor()': function() {
			var i = 1.12;

			i = Math.floor(i);
		},
		'~~ operand': function() {
			var i = 1.12;

			i = ~~1.12;
		}
	}
}
