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


var formatMicroBuck = function(x){return (x/1000000).toFixed(2)}
var getImp = function(x){return data[x].impressions};
var getCPC = function(x){return formatMicroBuck(data[x].observedCPC)};
var getCTR = function(x){return (data[x].observedCTR*100).toFixed(4)};
var getTotalSpent = function(x){return formatMicroBuck(data[x].total_spent)};

partitions = partitions.sort(function(a,b) { return getImp(a)-getImp(b) });

var getTotal = function() {
    var out = 0;
    partitions.forEach(function(s) {
        out += getImp(s);
    });
    return out;
}
var total = getTotal();

/* Sizing and scales. */
var h = document.body.clientHeight*0.8,
    w = h,
    r = w / 2,
    a = pv.Scale.linear(0, total).range(0, 2 * Math.PI);

/* The root panel. */
var vis = new pv.Panel()
    .width(w)
    .height(h)
    .left((document.body.clientWidth-w)/2)
    .right((document.body.clientWidth-w)/2)
    .top((document.body.clientHeight-h)/2)
    .bottom((document.body.clientHeight-h)/2);

/* The wedge, with centered label. */
vis.add(pv.Wedge)
    .data(partitions)
    .bottom(w / 2)
    .left(w / 2)
    .innerRadius(0)
    .outerRadius(r)
    .angle(function(x) { return a(getImp(x))  })
    //.title(function(d) { return d + ": "+((getImp(d)/total)*100).toFixed(2)+"% (" + getImp(d) + " imp)"})
    .title(function(d) { return d+': '+getCPC(d)+'$ CPC, '+getCTR(d)+'% CTR, '+getTotalSpent(d)+'$ total spent'})
  .anchor("center").add(pv.Label)
    .visible(function(d) { return getImp(d)/total > 0.01} )
    .text(function(d){ return d+ ": "+((getImp(d)/total)*100).toFixed(2)+"% (" + getImp(d) + " imp)"});

vis.render();