describe('GraphFactory creates graph', function () {  
    it('with specified title', function () {
    	var graphFactory = new TLRGRP.BADGER.Dashboard.GraphFactoryNew();
    	var expectedTitle = 'GraphTitle';
    	var firstComponent = graphFactory.getGraphsFor({
    		title: expectedTitle
    	})[0];

        expect(firstComponent.title).toEqual(expectedTitle);  
    });  
});  