/*

Copyright (c) 2011 Recoset <nicolas@recoset.com> <francois@recoset.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

times.sort();

var hostShare = function(t,h) { return data[t + ";" + h] != undefined ? data[t + ";" + h] : 0; };
var cpi = function(t) { return stats[t] != undefined ? stats[t].observedCPI : 0; };
var clicks = function(t) { return stats[t] != undefined ? stats[t].clicks : 0; };
var cpc = function(t) { return stats[t] != undefined ? stats[t].observedCPC : 0; };
var spent = function(t) { return stats[t] != undefined ? stats[t].total_spent : 0; };
var ctr = function(t) { return stats[t] != undefined ? stats[t].observedCTR : 0; };
var imp = function(t) { return stats[t] != undefined ? stats[t].impressions : 0; };
var gimp = function(t) { return stats[t] != undefined ? (stats[t].ghostImpressions/(stats[t].impressions+stats[t].ghostImpressions)*100).toFixed(2) : 0; };
var gimpAbs = function(t) { return stats[t] != undefined ? stats[t].ghostImpressions : 0; };


var maxImp = pv.max(times.map(imp));
var maxCTR = pv.max(times.map(ctr));
var maxCPI = pv.max(times.map(cpi));
var maxCPC = pv.max(times.map(cpc));

var w = times.length*20,
    h = document.body.clientHeight*0.95,
    streamGraphHeight = h/3,
    x = pv.Scale.ordinal(times).splitBanded(0, w),
    y = pv.Scale.linear(0, 1).range(0, streamGraphHeight),
    yIMP = pv.Scale.linear(0, maxImp).range(0, h/20)
    yGIMP = pv.Scale.linear(0, 100).range(0, h/20)
    yCTR = pv.Scale.linear(0, maxCTR).range(0, h/20)
    yCPI = pv.Scale.linear(0, maxCPI).range(0, h/20),
    yCPC = pv.Scale.linear(0, maxCPC).range(0, h/20),
    c= pv.Colors.category19(hosts);
 
var vis = new pv.Panel()
    .width(w)
    .height(h);

if (w < document.body.clientWidth) { 
    vis.left((document.body.clientWidth-w)/2)
       .right((document.body.clientWidth-w)/2); 
}
    
      vis.add(pv.Bar)
          .data(times)
          .bottom(9*h/10)
          .height(function(d) {return yIMP(imp(d));})
          .left( x )
          .width( x.range().band )
          .fillStyle("#9467bd")
          .title(function(d) {return imp(d) + " impressions at " + d + " ($" + (spent(d)/1000000).toFixed(2) + " spent)"});

      vis.add(pv.Label).bottom(9.5*h/10).text("Impressions");
      
      vis.add(pv.Bar)
          .data(times)
          .bottom(8*h/10)
          .height(function(d) {return yGIMP(gimp(d));})
          .left( x )
          .width( x.range().band )
          .fillStyle("#aaa")
          .title(function(d) {return gimp(d) + "% ghost impressions at " + d + " (abs:"+gimpAbs(d)+")"});

      vis.add(pv.Label).bottom(8.5*h/10).text("Ghosts");
      
      vis.add(pv.Bar)
          .data(times)
          .bottom(7*h/10)
          .height(function(d) {return yCPC(cpc(d));})
          .left( x )
          .width( x.range().band )
          .fillStyle("#1f77b4")
          .title(function(d) {return "$" + (cpc(d)/1000000).toFixed(2) + " CPC at " + d + " (" + clicks(d) + " clicks)"});

      vis.add(pv.Label).bottom(7.5*h/10).text("CPC");
      
      vis.add(pv.Bar)
          .data(times)
          .bottom(2.5*h/10)
          .height(function(d) {return yCTR(ctr(d))})
          .left( x )
          .width( x.range().band )
          .fillStyle("#637939")
          .title(function(d) {return (100*ctr(d)).toFixed(3) + "% CTR at " + d + " (" + clicks(d) + " clicks)"});

      vis.add(pv.Label).bottom(3*h/10).text("CTR");

      vis.add(pv.Bar)
          .data(times)
          .bottom(1.5*h/10)
          .height(function(d) { return yCPI(cpi(d))})
          .left( x )
          .width( x.range().band )
          .fillStyle("#843c39")
          .title(function(d) {return "$" + (cpi(d)/1000).toFixed(2) + " CPM at " + d});

      vis.add(pv.Label).bottom(2*h/10).text("CPM");


vis.add(pv.Bar).bottom(h/2 - streamGraphHeight/2).left(0).width(w).height(streamGraphHeight).fillStyle("#eee");

vis.add(pv.Layout.Stack)
    .layers(hosts)
    .values(times)
    .order("inside-out")
    .offset("silohouette")
    .x( function(t) {return x(t) + x.range().band/2 })
    .y( function(t, h) {return y(hostShare(t,h)) })
  .layer.add(pv.Area)
    .fillStyle(function(t,h) {return c(h)})
    .title(function(t,h) {return h});
 

      vis.add(pv.Rule)
          .data(times)
          .left( x )
          .strokeStyle(function(s) {return s.indexOf("00") != -1 ? "rgba(233, 233, 233, .9)":"rgba(255, 255, 255, .2)"})
        .anchor("right").add(pv.Label)
          .visible(function(s) {return s.indexOf("00") != -1})
          .text(function(s) {return s})
          .textAngle(-Math.PI / 2);

vis.render();
