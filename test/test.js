var
	expect = chai.expect,
	DEBUG = true;


describe('Rimd', function() {
	describe('constructor', function() {
		var
			rimd = new Rimd;

		it('should load the image', function() {
			var
				elem = rimd.test.legacyGetElementByClass('rimd'),
				localRimd = new Rimd();

			expect(elem[0].getElementsByTagName('img').length).to.be.ok;
		});
	});

	describe('getClosestValues', function() {
		var
			rimd = new Rimd;

		it('should return closest value from array', function () {
			expect(rimd.test.getClosestValues([150, 400, 550, 600], 410) === 400).to.be.true;
		});

		it('should return closest value above from array', function () {
			rimd.options.closestAbove = true;
			expect(rimd.test.getClosestValues([150, 400, 550, 600], 410) === 550).to.be.true;
		});
	});

	describe('extend', function() {
		var
			rimd = new Rimd;

		it('should extend an object with another', function () {
			expect(rimd.test.extend({
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

	describe('legacyGetElementByClass', function() {
		var
			rimd = new Rimd;

		it('should return a nodeList with elements with the class', function() {
			expect(rimd.test.legacyGetElementByClass('legacyGetElementByClass').length).to.be.equal(2);
		});
	});

	describe('getImageAttributes', function() {
		var
			rimd = new Rimd;

		it('should return the data attributes of the element', function() {
			var
				elem = rimd.test.legacyGetElementByClass('getImageAttributes');

			expect(rimd.test.getImageAttributes(elem)).to.deep.equal([{
				'src': 'path/to/image.jpg',
				'alt': 'Alt',
				'title': 'Title',
				'offsetHeight': 0,
				'offsetWidth': 400,
				'path': 'resimage/?image=path/to/image.jpg&w=320',
				'width': 320
			}]);
		}); 
	});
});