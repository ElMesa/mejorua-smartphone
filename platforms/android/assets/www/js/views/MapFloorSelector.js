var mejorua = mejorua || {};
mejorua.views = mejorua.views || {};

(function() {
    mejorua.views.MapFloorSelector = function IssueDetail() {

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// ATRIBUTTES
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    	
    	var self = this;
    	this.id = 'floorSelectorNav';
    	
    	this.floorDefault = 'ground';
        this.floor = undefined;
        
        //Maps "this.floor" values with the associated id of the DOM btn that triggers the floor change
        this.floorSelectorMapping = {};
        this.floorSelectorMapping.basement = 'btn_floorSelector_basement';
        this.floorSelectorMapping.ground = 'btn_floorSelector_ground';
        this.floorSelectorMapping.first = 'btn_floorSelector_first';
        this.floorSelectorMapping.second = 'btn_floorSelector_second';
        this.floorSelectorMapping.third = 'btn_floorSelector_third';
        this.floorSelectorMapping.fourth = 'btn_floorSelector_fourth';
    	
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		///
		/// METHODS
		///
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    	
    	this.init = function init() {
    		console.log('mejorua.views.MapFloorSelector - init()');
    		
    		$('#' + self.id +' .navbar-collapse a').on('click', function() {
    	        if ($('#' + self.id +' .navbar-collapse').hasClass('in')) {
    	            console.log('.navbar-collapse.in a CKLICK');
    	            $('#' + self.id +' .navbar-toggle').click();
    	        }
    	    });
    		
    		this.setFloor(this.floorDefaul);
    	}
    	
    	this.setFloor = function setFloor(newFloor) {
        	
        	for(floor in this.floorSelectorMapping) {
        		var $floor = $('#' + this.floorSelectorMapping[floor]);
        		if(floor == newFloor) {
        			$floor.toggleClass( 'active', true);
        			$floor.prop('disabled');
        		} else {
        			$floor.toggleClass( 'active', false);
        			$floor.removeProp('disabled');
        		}
        	}
        	
        	this.floor = newFloor;
        }

    	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		///
		/// SELF-INITIALIZATION
		///
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    	
    	this.init();
}})();