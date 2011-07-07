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


// Look in querystring for 'noerrorbars'
if (window.location.search.substring(1).indexOf('noerrorbars')>-1) {
    var cpcUpper=function(x){return 0};
    var cpcLower=function(x){return 0};
} else {
    var cpcUpper=function(x){return ((data[x].cpcBounds==undefined || data[x].cpcBounds[1]==undefined) ? 999.99 : data[x].cpcBounds[1]/1000000)};
    var cpcLower=function(x){return ((data[x].cpcBounds==undefined || data[x].cpcBounds[0]==undefined) ? 0 : data[x].cpcBounds[0]/1000000)};
}

if (window.location.search.substring(1).indexOf('trimlast')>-1) {
    partitions = partitions.slice(0,-1);
}
if (window.location.search.substring(1).indexOf('trimfirst')>-1) {
    partitions = partitions.slice(1);
}

function imp(x) { return data[x].impressions; };
function cpc(x) { return data[x].observedCPC/1000000; };

function getAvgCpc() {
    var accum_spent = 0.0;
    var accum_clicks = 0.0;
    partitions.forEach(function(p) {
        accum_spent += data[p].total_spent;
        accum_clicks += data[p].clicks;
    });
    return (accum_spent/accum_clicks)/1000000;
}
var avgCpc = getAvgCpc();

var errorBarColor = function(x) {
	if (data[x]==undefined || data[x].cpcBounds==undefined) return '9a9a9a'; // gray

	var err = (cpcUpper(x)-cpcLower(x)) / (cpcUpper(x)+cpcLower(x));
    return err < 0.25 ? '#29ae13' : '#ae1325'
}

var maxImp = partitions.reduce(function(a,b){ return Math.max(a, imp(b))}, 0);
    maxImp *= 1.1;

    var h = document.body.clientHeight*0.9 - 100,
        w = h*1.333,

          barWidth = w/partitions.length,
          x = pv.Scale.ordinal(partitions).split(0, w),
          y = pv.Scale.linear(0, maxImp).range(0, h),
          y2 = pv.Scale.linear(0, 10).range(0,h),
          cpcFormat = function(cpc) {return "$" + (cpc).toFixed(2) + " CPC"};

      var vis = new pv.Panel()
          .width(w)
          .height(h)
          .left((document.body.clientWidth-w)/2)
          .right((document.body.clientWidth-w)/2)
          .bottom((document.body.clientHeight-h));

      /* Number of Impressions. */
      vis.add(pv.Bar)
          .data(partitions)
          .bottom(0)
          .height(function(d){return y(imp(d))})
          .left(function(d){return x(d)-barWidth/2})
          .width(barWidth)
          .fillStyle("#aaa")
          .strokeStyle("#999")
          .title(function(d) { return d + ": " + imp(d) + " impressions ($" + (data[d].total_spent/1000000).toFixed(2) + " spent)"});

      /* Left Y-axis. */
      vis.add(pv.Rule)
          .bottom(-.5)
        .add(pv.Rule)
          .data( y.ticks())
          .bottom(y)
          .strokeStyle("rgba(255, 255, 255, .2)")
        .anchor("left").add(pv.Label).text(y.tickFormat);

      vis.add(pv.Label)
          .data(["Impressions"])
          .left(-45)
          .bottom(h/2)
          .textAlign("center")
          .textAngle(-Math.PI/2);
      
      /* Right Y-axis. */
      //vis.add(pv.Rule).bottom(y2(5)).anchor("right").add(pv.Label).text(cpcFormat(5));
      vis.add(pv.Rule).bottom(y2(avgCpc)).anchor("right").add(pv.Label).text('Avg:'+cpcFormat(avgCpc));
            

      /* X-axis. */
      vis.add(pv.Rule)
          .data(partitions)
          .bottom(0)
          .left(x)
          .height(-4)
        .anchor("bottom").add(pv.Label)
          .textMargin(8)
    .textAngle(-Math.PI / 2)
    .textBaseline("middle").textAlign("right");

    /* CPC Confidence interval */
    vis.add(pv.Bar)
        .data(partitions)
        .left(function(d) { return x(d)-1})
        .width(2)
        .bottom(function(x){ return y2(cpcLower(x)) })
        .height(function(x){ return y2(cpcUpper(x) - cpcLower(x))})
        .strokeStyle(function(x){return errorBarColor(x)})
        .fillStyle(function(x){return errorBarColor(x)})
        .title(function (x){return x + ": " + cpcFormat(cpcLower(x)) + " to " + cpcFormat(cpcUpper(x))});

    /* Sample CPC */
    vis.add(pv.Dot)
        .data(partitions)
        .left( x )
        .size(8)
        .bottom(function(x){ return y2(cpc(x))})
        .strokeStyle("black")
        .fillStyle("black")
        .title(function(x){ return x + ": " + cpcFormat(cpc(x)) + " observed ("+data[x].clicks+" clicks)"});

      vis.render();
