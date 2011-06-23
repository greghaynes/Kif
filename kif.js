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

Kif.prototype.loadSlide = function(name) {
	$("#kif").html("content");
}

Kif.prototype.loadNav = function() {
	nav_elem = $("<div id=\"kif_nav\"></div>");
	nav_elem.appendTo("#kif");

	this.nav_canv = Raphael(10, 10, 200, 50);
	var first_cont = this.nav_canv.rect(0, 0, 40, 40, 10);
	first_cont.attr({fill: "#222", opacity: 0.5});
	var first_arr = this.nav_canv.set();
	first_arr.push(this.nav_canv.path("M10 10L30 20L10 30L10 10"),
	               this.nav_canv.path("M32 10L32 32"));
	first_arr.attr({stroke: "#DDD", fill: "#DDD", opacity: 0.5});
}
