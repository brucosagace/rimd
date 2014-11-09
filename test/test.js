expect = chai.expect;

describe('Rimd', function() {
	var
		rimd = new Rimd;

	describe('getClosestValues', function() {
		it('should return closest value from array', function () {
			expect(rimd.t.getClosestValues([150, 400, 550, 600], 410) === 400).to.be.true;
		});

		it('should return closest value above from array', function () {
			expect(rimd.t.getClosestValues([150, 400, 550, 600], 410, true) === 550).to.be.true;
		});
	});

	describe('extend', function() {
		it('should extend an object with another', function () {
			expect(rimd.t.extend({
				a: 'b',
				c: 'd'
			}, {
				a: 'e',
				f: 'g'
			})).to.deep.equal({
				a: 'e',
				c: 'd',
				f: 'g'
			});
		});
	});
});