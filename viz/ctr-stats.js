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


var maxImp = partitions.reduce(function(a,b){return Math.max(a, data[b].impressions)}, 0);
maxImp *= 1.1;


function getAvgCtr() {
    var accum_imp = 0.0;
    var accum_clicks = 0.0;
    partitions.forEach(function(p) {
        accum_imp += data[p].impressions;
        accum_clicks += data[p].clicks;
    });
    return accum_clicks/accum_imp;
}
var avgCtr = getAvgCtr();


      var errorBarColor = function(x) {
          if (data[x]==undefined || data[x].ctrBounds==undefined) return '9a9a9a'; // gray

          var err = (data[x].ctrBounds[1]-data[x].ctrBounds[0]) / (data[x].ctrBounds[1]+data[x].ctrBounds[0]);
          return err < 0.25 ? '#29ae13' : '#ae1325'
      }

      var h = document.body.clientHeight*0.9 - 100,
          w = h*1.333,

          barWidth = w/partitions.length,
          x = pv.Scale.ordinal(partitions).split(0, w),
          y = pv.Scale.linear(0, maxImp).range(0, h),
          y2 = pv.Scale.linear(0, 0.001).range(0,h),
          ctrFormat = function(ctr) {return (100*ctr).toFixed(3) + "% CTR"};

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
          .height(function(d) {return y(data[d].impressions)})
          .left(function(d) {return x(d)-barWidth/2})
          .width(barWidth)
          .fillStyle("#aaa")
          .strokeStyle("#999")
          .title(function(d) {return d + ": " + data[d].impressions + " impressions ($" + (data[d].total_spent/1000000).toFixed(2) + " spent)"});

      /* Left Y-axis. */
      vis.add(pv.Rule)
          .bottom(-.5)
        .add(pv.Rule)
          .data( y.ticks() )
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
      //vis.add(pv.Rule).bottom(y2(0.0005)).anchor("right").add(pv.Label).text(ctrFormat(0.0005));
      
      vis.add(pv.Rule).bottom(y2(avgCtr)).anchor("right").add(pv.Label).text('Avg:'+ctrFormat(avgCtr));

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

    /* CTR Confidence interval */
    vis.add(pv.Bar)
        .data(partitions)
        .left(function(d){return x(d)-1})
        .width(2)
        .bottom(function(d){return y2((data[d].ctrBounds==undefined ? 0 : data[d].ctrBounds[0]))})
        .height(function(d){return y2((data[d].ctrBounds==undefined ? 0 : data[d].ctrBounds[1]-data[d].ctrBounds[0]))})
        .strokeStyle(function(x){return errorBarColor(x)})
        .fillStyle(function(x){return errorBarColor(x)})
        .title(function (d){return d + ": " + ctrFormat((data[d].ctrBounds==undefined ? 0 : data[d].ctrBounds[0])) + 
            " to " + ctrFormat((data[d].ctrBounds==undefined ? 0 : data[d].ctrBounds[1])) + " bounds"});

    /* Sample CTR */
    vis.add(pv.Dot)
        .data(partitions)
        .left(function(d){return x(d)})
        .size(8)
        .bottom(function(d){return y2(data[d].observedCTR)})
        .strokeStyle("black")
        .fillStyle("black")
        .title(function(d){return d + ": " + ctrFormat((data[d].ctrBounds==undefined ? 0 : data[d].observedCTR)) + 
            " observed ("+data[d].clicks+" clicks)"});

      vis.render();
