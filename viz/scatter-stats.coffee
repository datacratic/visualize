###

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

###

ipc = (x) -> 1000000/data[x].observedCPI
ctr = (x) -> data[x].observedCTR

getMax = (f) -> pv.max(partitions.map(f))
getMin = (f) -> pv.min(partitions.map(f))
      
maxCTR = 1.1* getMax(ctr)
maxIPC = 1.1* getMax(ipc)
      
h = document.body.clientHeight*0.9
w = h*1.333
x = pv.Scale.linear(0, maxIPC).range(0, w)
y = pv.Scale.linear(0, maxCTR).range(0, h)

vis = new pv.Panel()
.width(w)
.height(h)
.left((document.body.clientWidth-w)/2)
.right((document.body.clientWidth-w)/2)
.bottom((document.body.clientHeight-h))


# Y-axis
vis.add(pv.Rule)
.data(y.ticks())
.bottom(y)
.strokeStyle((d) -> if d==0 then "#000" else "#eee")
.anchor("left").add(pv.Label)
.text( (d) -> (d*100).toFixed(2)+"%" )

vis.add(pv.Label)
    .data(["Click-Through Rate (CTR)"])
    .left(-45)
    .bottom(h/2)
    .textAlign("center")
    .textAngle(3*Math.PI/2);
    
# X-axis
vis.add(pv.Rule)
.data(x.ticks())
.left(x)
.strokeStyle((d) -> if d==0 then "#000" else "#eee")
.anchor("bottom").add(pv.Label)
.text(x.tickFormat)

vis.add(pv.Label)
    .data(["Impressions per dollar (Imp/$)"])
    .left(w/2)
    .bottom(-50)
    .textAlign("center");
    
# CPC curves
pv.range(0.25,5.25,0.25).map( (cpc) ->
    vis.add(pv.Line)
    .data( pv.range(0,maxIPC,10) )
    .left( x )
    .width( 1 )
    .strokeStyle( if parseFloat(cpc) == parseInt(cpc) then "#999" else  "#ddd")
    .bottom( (ipc) -> y( Math.min( maxCTR, 1/((ipc+1) * cpc)) ) )
)

cpcFormat = (x) -> "$" + (x/1000000).toFixed(2)

# X-errors
vis.add(pv.Bar)
.data(partitions)
.fillStyle("#999")
.bottom( (d) -> y(data[d].observedCTR) )
.height(2)
.left( (d) -> x(1000000/data[d].cpiBounds[1]) )
.width( (d) -> x(1000000/data[d].cpiBounds[0] - 1000000/data[d].cpiBounds[1]) )
# Y-errors
.add(pv.Bar)
.width(1)
.left( (d) -> x(1000000/(data[d].observedCPI)) )
.bottom( (d) -> y(data[d].ctrBounds[0]) )
.height( (d) -> y(data[d].ctrBounds[1] - data[d].ctrBounds[0]))
# midpoints
.add(pv.Dot)
.bottom( (d) -> y(data[d].observedCTR) )
.left( (d) -> x(1000000/(data[d].observedCPI)) )
.title( (d) -> d + ": cpc = " + cpcFormat(data[d].cpcBounds[0])  + " to " + cpcFormat(data[d].cpcBounds[1]) + " (" + cpcFormat(data[d].observedCPC) + " observed)")

vis.render()
