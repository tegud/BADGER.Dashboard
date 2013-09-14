describe('GraphFactory', function () {
	describe('getGraphsFor', function () {    
	    it('sets title', function () {
	    	var graphFactory = new TLRGRP.BADGER.Dashboard.GraphFactoryNew('1hour');
	    	var expectedTitle = 'GraphTitle';
	    	var firstComponent = graphFactory.getGraphsFor({
	    		title: expectedTitle
	    	})[0];

			expect(firstComponent.title).to.eql(expectedTitle);
	    });
    });  
});  