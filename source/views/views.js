/**
	For simple applications, you might define all of your views in this file.  
	For more complex applications, you might choose to separate these kind definitions 
	into multiple files under this folder.
*/
enyo.kind({
	name: "myapp.MainView",
	kind: "moon.Panels",
	pattern: "activity",
	classes: "moon enyo-fit enyo-unselectable",
	components: [
		{kind: "moon.Panel", onChange: "pickerChanged", title:"Travel Republic", headerComponents: [
			{kind: "moon.InputDecorator", name:'filterinputName', classes:'hide', components: [
				{kind: "moon.Input", name: "filterNameData", placeholder: "Type Name",onchange:"handleChange"},
				{kind: "Image", src: "assets/search-input-search.png"}
			]},
			{kind: "moon.InputDecorator", name:'filterinputNumber', classes:'hide', components: [
				{kind: "moon.Input", name: "filterNumData", placeholder: "Type for more than", type: "number",onchange:"handleChange"}
			]}
		],
		components: [
			{kind: 'FittableRows', classes: 'enyo-fit', components:[
			{kind: 'FittableColumns', fit: true, components:[
			    {kind: 'FittableRows', style: 'width: 20%', components:[
			    	{ kind: 'moon.Scroller', classes: "enyo-fill", components: [
			    		{kind: "moon.ExpandablePicker",noneText: "Nothing selected", content: "Sort By", components: [
							{content: "Distance"},
							{content: "Stars"},
							{content: "MinCost"},
							{content: "TrpRating"},
							{content: "UserRating"}
			    		]},
			    		{kind: "moon.ExpandablePicker",noneText: "Nothing selected", content: "Filter By", components: [
							{content: "Name"},
							{content: "Stars"},
							{content: "TrpRating"},
							{content: "UserRating"},
							{content: "MinCost"}
			    		]}
			    	]}
			    ]},
				{name: "gridList", fit: true, minWidth: 180, minHeight: 270, kind: "moon.DataGridList", scrollerOptions: { kind: "moon.Scroller", vertical:"scroll", horizontal: "hidden", spotlightPagingControls: true }, components: [
					{kind: 'moon.GridListImageItem', imageSizing: 'cover', useSubCaption: true, centered: true, bindings: [
						{from: ".model.Name", to: ".caption"},
						{from: ".model.UserRating", to: ".subCaption"},
						{from: ".model.ImageUrl", to: ".source"}
					]}
				]}
			]},
		  ]},
		]}
	],
	bindings: [
		{from: ".collection", to: ".$.gridList.collection"}
	],
	records: [],
	create: function () {
		this.inherited(arguments);
		this.generateRecords();
	},
	rendered: function(){
		this.inherited(arguments);
	},
	generateRecords: function () {
		var ajax = new enyo.Ajax({
			url: 'assets/hotels.json'
		});
		// send parameters the remote service using the 'go()' method
		ajax.go();
		// attach responders to the transaction object
		ajax.response(this, "processResponse");
		// handle error
		ajax.error(this, "processError");
	},
	processResponse: function(inSender, inResponse){
		this.records= inResponse.Establishments;
	    // we set the collection that will fire the binding and add it to the list
		this.set("collection", new enyo.Collection(this.records));
	},
	processError: function(inSender,inResponse){
		console.log("Error while fetching JSON");
	},
	handleChange: function(){

		if(event.target.type!=='number'){
			var filterby= this.$.filterNameData.filterby;
			var data=this.$.filterNameData.value;
			var _collection= new enyo.Collection(this.records);
			if(data){
				_collection= _collection.filter(filternames);
				function filternames(element) {
					if((element.get('Name').toLowerCase().search(data.toLowerCase()))!==-1)
						return 1;
				}
			}
			this.set("collection",new enyo.Collection(_collection));	
		}
		if(event.target.type==='number'){
			var filterby= this.$.filterNumData.filterby;
			var data=parseFloat(this.$.filterNumData.value);
			var _collection= new enyo.Collection(this.records);
			if(data){
				_collection= _collection.filter(filterfunc);
				function filterfunc(element) {
					return (element.get(filterby) >data)
				}
			}
			this.set("collection",new enyo.Collection(_collection));
		}
	},
	pickerChanged: function(inSender, inEvent) {
		var value,
		picker = inEvent.originator.getContent();
		if (inEvent.originator instanceof moon.ExpandablePicker) {
			value = inEvent.content;
			if(picker==='Sort By'){
				this.sortData(value);
			}	
			else if(picker==='Filter By' && value==='Name'){
				this.$.filterNameData.filterby= value;
				this.$.filterinputName.removeClass('hide');
				this.$.filterinputNumber.addClass('hide');
			}
			else if(picker==='Filter By' && value!=='Name'){
				this.$.filterNumData.filterby= value;
				this.$.filterinputName.addClass('hide');
				this.$.filterinputNumber.removeClass('hide');
			}
		}
	},
	sortData: function(value){
		this.$.filterinputName.addClass('hide');
		this.$.filterinputNumber.addClass('hide');
		// we fetch our collection reference
		var collection = this.get("collection");
		if(value)
		collection.sort(function(a, b) {
			var x= a.get(value), y=b.get(value);
			return x<y? -1 : x>y ? 1 : 0;
		});
	}
});

