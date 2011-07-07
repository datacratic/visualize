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


maxPrecision = 0
for modelName, modelResults of data
    for k,v of modelResults.data.model
        maxPrecision = v.precision if maxPrecision < v.precision

# Sizing and scales.
h = document.body.clientHeight*0.9
w = h*1.333
x = pv.Scale.linear(0, 1).range(0, w)
y = pv.Scale.linear(0, maxPrecision).range(0, h)
c = pv.Colors.category10((modelName for modelName of data))

# The root panel.
vis = new pv.Panel()
    .width(w)
    .height(h)
    .left((document.body.clientWidth-w)/2)
    .right((document.body.clientWidth-w)/2)
    .bottom((document.body.clientHeight-h-30))
    .top(20)

# X-axis ticks.
vis.add(pv.Rule)
    .data(x.ticks())
    .left(x)
    .strokeStyle("#eee")
  .add(pv.Rule)
    .bottom(-5)
    .height(5)
    .strokeStyle("#000")
  .anchor("bottom").add(pv.Label)
    .text(x.tickFormat)

# Y-axis ticks.
vis.add(pv.Rule)
    .data(y.ticks())
    .bottom(y)
    .strokeStyle((d) -> if d? then "#eee" else "#000")
  .anchor("left").add(pv.Label)
    .text(y.tickFormat)

niceModelName = (x) -> /[^-]*-(.*)\.[^\.]*/.exec(x)[1].replace(/_/g, " ")

# The line.
for modelName, {data: {model: model}} of data
    do (modelName, model) ->
        t_tresh = []
        for tt, v of model
            t_tresh.push(tt) if not (v.tpr==v.precision==0)
        t_tresh.sort((a, b) -> parseFloat(a)-parseFloat(b))            
        if !isNaN(parseFloat(t_tresh[1])) && isFinite(t_tresh[1])
            vis.add(pv.Line)
                .data(t_tresh)
                .left((d) -> x(model[d].tpr))
                .bottom((d) -> y(model[d].precision))
                .lineWidth(2)
                .strokeStyle(c(modelName))
                
        dots= vis.add(pv.Dot)
            .data(t_tresh)
            .left((d) -> x(model[d].tpr))
            .bottom((d) -> y(model[d].precision))
            .strokeStyle(c(modelName)).fillStyle(c(modelName))
            .size(2)
            .title((d) -> niceModelName(modelName)+'\nTPR: '+model[d].tpr+'\nFPR: '+model[d].fpr+'\nAROC: '+data[modelName].data.aroc+'\nThresh: '+d)

        if not (!isNaN(parseFloat(t_tresh[1])) && isFinite(t_tresh[1]))
            dots.size(7).anchor("bottom")
                .add(pv.Label)
                .text( (d) -> d.split(" ")[0].split("_").join(" ") )
                .visible((d) -> 
                    a = model[d].tpr
                    b = model[d].precision
                    return a*a + b*b > 0.12
                )
                
models = (modelName for modelName of data)
vis.add(pv.Panel)
    .right(40).width(300)
    .top(140).height(models.length * 25 + 20)
    .fillStyle("white").strokeStyle("grey")
    .antialias(false).lineWidth(1)
  .add(pv.Dot)
    .data( models )
    .strokeStyle(c).fillStyle(c)
    .size(15)
    .left(20).top( -> this.index*25+20)
    .anchor("right").add(pv.Label).font("16 px sans-serif")
    .text( niceModelName )

# Y-axis label
vis.add(pv.Label)
    .data(["Precision (TP/[TP+FP])"])
    .left(-45)
    .bottom(h/2)
    .textAlign("center")
    .textAngle(-Math.PI/2)

# X-axis label
vis.add(pv.Label)
    .data(["Recall (TP/[TP+FN])"])
    .left(w/2)
    .bottom(-50)
    .textAlign("center")


vis.render()
