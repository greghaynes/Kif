function KifNavButton(name, canvas, start_x, start_y, type) {
	this.start_x = start_x;
	this.start_y = start_y;

	this.canv_container = canvas.rect(start_x, start_y, 40, 40, 10);
	this.canv_container.attr({fill: "#222", opacity: 0.5});
	this.canv_doodle = canvas.set();

	var canv_container = this.canv_container;
	var canv_doodle = this.canv_doodle;

	if(type == "next" || type == "last") {
		canv_doodle.push(
			canvas.path("M"+(start_x+10)+" "+(start_y+10)+"L"+(start_x+30)+" "+(start_y+20)+"L"+(start_x+10)+" "
				+(start_y+30)+"L"+(start_x+10)+" "+(start_y+10)));

		if(type == "last")
			canv_doodle.push(canvas.path("M"+(start_x+32)+" "+(start_y+10)+"L"+(start_x+32)+" "+(start_y+32)));
	} else if(type == "prev" || type == "first") {
		canv_doodle.push(
			canvas.path("M"+(start_x+10)+" "+(start_y+20)+"L"+(start_x+30)+" "+(start_y+30)+"L"+(start_x+30)+" "
				+(start_y+10)+"L"+(start_x+10)+" "+(start_y+20)));

		if(type == "first")
			canv_doodle.push(canvas.path("M"+(start_x+8)+" "+(start_y+10)+"L"+(start_x+8)+" "+(start_y+32)));
	}

	canv_doodle.attr({stroke: "#DDD", fill: "#DDD", opacity: 0.5});

	this.whole_button = canvas.set();
	this.whole_button.push(canv_container, canv_doodle);

	this.whole_button.hover(
		function(event) {
			canv_container.attr({opacity: 1.0});
			canv_doodle.attr({opacity: 1.0});
		},
		function(event) {
			canv_container.attr({opacity: 0.4});
			canv_doodle.attr({opacity: 0.4});
		});
}

function KifNavbar(start_x, start_y) {
	this.jq = $("<div id=\"kif_navbar\"></div>");
	this.jq.appendTo("#kif");
	this.canvas = Raphael("kif_navbar", 185, 40);

	this.first_button = new KifNavButton("first", this.canvas, start_x+5, start_y, "first");
	this.prev_button = new KifNavButton("prev", this.canvas, start_x+50, start_y, "prev");
	this.next_button = new KifNavButton("next", this.canvas, start_x+95, start_y, "next");
	this.last_button = new KifNavButton("last", this.canvas, start_x+140, start_y, "last");

	var all_buttons = this.canvas.set();
	all_buttons.push(
		this.first_button.whole_button,
		this.prev_button.whole_button,
		this.next_button.whole_button,
		this.last_button.whole_button);
	all_buttons.attr({opacity: 0.0});

	this.jq.hover(
		function(event) {
			all_buttons.attr({opacity:0.4})
		},
		function(event) {
			all_buttons.attr({opacity: 0.0});
		});
}

function Kif(pres_info) {
	this.pres_info = pres_info;
	
	// Determine current slide
	var url = decodeURI(window.location);
	var slide = pres_info["slides"][0];
	var lb_ndx = url.indexOf("#");
	if(lb_ndx >= 0)
		slide = url.substring(lb_ndx + 1);

	this.loadNav();

	this.loadSlide(slide);
}

Kif.prototype.first = function() {
	console.log("first");
}

Kif.prototype.prev = function() {
	console.log("prev");
}

Kif.prototype.next = function() {
	console.log("next");
}

Kif.prototype.last = function() {
	console.log("last");
}

Kif.prototype.loadSlide = function(name) {
}

Kif.prototype.loadNav = function() {
	this.navbar = new KifNavbar(0, 0);

	this.navbar.first_button.whole_button.click(this.first);
	this.navbar.prev_button.whole_button.click(this.prev);
	this.navbar.next_button.whole_button.click(this.next);
	this.navbar.last_button.whole_button.click(this.last);
}
