/* Copyright (c) 2011 Gregory Haynes <greg@greghaynes.net>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

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
	} else if(type == "home") {
		canv_doodle.push(
			canvas.path("M"+(start_x+5)+" "+(start_y+15)+"L"+(start_x+20)+" "+(start_y+5)+"L"+(start_x+35)+" "
				+(start_y+15)+"L"+(start_x+5)+" "+(start_y+15)),
			canvas.rect(start_x+10, start_y+17, 20, 15));
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
	this.jq = $("#kif_navbar");
	this.canvas = Raphael("kif_navbar", 230, 65);

	this.first_button = new KifNavButton("first", this.canvas, start_x+5, start_y, "first");
	this.prev_button = new KifNavButton("prev", this.canvas, start_x+50, start_y, "prev");
	this.next_button = new KifNavButton("next", this.canvas, start_x+95, start_y, "next");
	this.last_button = new KifNavButton("last", this.canvas, start_x+140, start_y, "last");
	this.home_button = new KifNavButton("home", this.canvas, start_x+185, start_y, "home");

	this.show_tab = this.canvas.set();
	this.show_tab.push(
		this.canvas.rect(22, 42, 185, 23, 5),
		this.canvas.text(115, 52, "Navigation"));
	this.show_tab.attr({fill: "#222", stroke: "#EEE", "font-size": 14});

	this.all_buttons = this.canvas.set();
	this.all_buttons.push(
		this.first_button.whole_button,
		this.prev_button.whole_button,
		this.next_button.whole_button,
		this.last_button.whole_button,
		this.home_button.whole_button);

	var t_this = this;

	this.jq.hover(
		function(event) {
			t_this.show();
		},
		function(event) {
			t_this.hide();
		});

	this.hide();
}

KifNavbar.prototype.hide = function() {
	this.jq.animate({top: -52}, 300);
}

KifNavbar.prototype.show = function() {
	this.jq.animate({top: 0}, 300);
}

function Kif(pres_info) {
	this.pres_info = pres_info;
	
	// Determine current slide
	var url = decodeURI(window.location);
	var slide = this.pres_info["slides"][0];
	var lb_ndx = url.indexOf("#");
	if(lb_ndx >= 0)
		slide = url.substring(lb_ndx + 1);

	this.loadNav();
	this.loadSlide(slide);
}

Kif.prototype.first = function() {
	this.loadSlide(this.pres_info["slides"][0]);
}

Kif.prototype.prev = function() {
	if(this.slide_ndx <= 0)
		return;
	this.loadSlide(this.pres_info["slides"][this.slide_ndx-1]);
}

Kif.prototype.next = function() {
	if((this.slide_ndx+1) >= this.pres_info["slides"].length || this.slide_ndx < 0)
		return;
	this.loadSlide(this.pres_info["slides"][this.slide_ndx+1]);
}

Kif.prototype.last = function() {
	this.loadSlide(this.pres_info["slides"][this.pres_info["slides"].length-1]);
}

Kif.prototype.home = function() {
	window.location = this.pres_info["home"];
}

Kif.prototype.loadSlide = function(name) {
	console.log("Loading slide "+name);
	window.location.hash = name;
	$("#kif_slide").html("<center><h3>Loading</h3></center>");
	$.get(name, function(data) {
		$("#kif_slide").html(data);
		});

	// Determine slide ndx
	this.slide_ndx = 0;
	for (i in this.pres_info["slides"]) {
		if(this.pres_info["slides"][i] == name)
			break;
		++this.slide_ndx;
	}
	if(this.pres_info["slides"][this.slide_ndx] != name)
		this.slide_ndx = -1;
}

Kif.prototype.loadNav = function() {
	this.navbar = new KifNavbar(0, 0);
	var t_this = this;

	this.navbar.first_button.whole_button.click(function() { t_this.first(); });
	this.navbar.prev_button.whole_button.click(function() { t_this.prev(); });
	this.navbar.next_button.whole_button.click(function() { t_this.next(); });
	this.navbar.last_button.whole_button.click(function() { t_this.last(); });
	this.navbar.home_button.whole_button.click(function() { t_this.home(); });
}
