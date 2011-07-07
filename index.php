<!--

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

-->

<? 
$datapath = isset($_GET["p"]) ? $_GET["p"] : "data";
?>

<html>
<head>
<title>Recoset DataViz</title>

<link rel="stylesheet" href="lib/treeview.css" type="text/css" />

<script type="text/javascript" src="lib/jquery-1.5.2.min.js"></script>
<script type="text/javascript" src="lib/jquery-ui-1.8.11.custom.min.js"></script>
<script type="text/javascript" src="lib/treeview.js"></script>

<style type="text/css">
    body { font-family: Verdana, sans;}
    .hidden { position:absolute; top:0; left:-9999px; width:1px; height:1px; overflow:hidden; }
	.popupBox {
		position: absolute;
		left: 10px; border: 1px outset grey; 
		background: white; 
		height: 600px; width: 400px; 
		overflow:scroll; 
		box-shadow: 3px 3px 4px grey;
	}
</style>
<script type="text/javascript">
$(function(){
    $("#browser").css({ opacity: 0.9 });
    $("#browser").load("tree.php?path=<?=$datapath?>",
             function(){ $("#browser").treeview({collapsed:true});});
             
    $("#contentsDiv").css("height", document.body.clientHeight - 100);
    
    // source: http://0061276.netsolhost.com/tony/javascript/urlEncode.js
    $.extend({URLEncode:function(c){var o='';var x=0;c=c.toString();var r=/(^[a-zA-Z0-9_.]*)/;
      while(x<c.length){var m=r.exec(c.substr(x));
        if(m!=null && m.length>1 && m[1]!=''){o+=m[1];x+=m[1].length;
        }else{if(c[x]==' ')o+='+';else{var d=c.charCodeAt(x);var h=d.toString(16);
        o+='%'+(h.length<2?'0':'')+h.toUpperCase();}x++;}}return o;},
    URLDecode:function(s){var o=s;var binVal,t;var r=/(%[^%]{2})/;
      while((m=r.exec(o))!=null && m.length>1 && m[1]!=''){b=parseInt(m[1].substr(1),16);
      t=String.fromCharCode(b);o=o.replace(m[1],t);}return o;}
    });

    doExport = function() {
    	$("#exportContents").val(
    		$("#contentsDiv").contents().find("span").html()
    	);
    	$("#exportForm").submit();
    };

    
    $('#logo').click(function() { 
		$("#browser").toggle("fast");
	});

    
    $.displayGraph = function(path, fileName, vizName, fileType, niceFileName) {
        
        var url = 'container.php?graph='+vizName+'-'+fileType+'&data='+path + fileName;
        
        $('#contentsDiv').attr('src', url);
        var superURL = "http://<?= $_SERVER["SERVER_NAME"].$_SERVER["PHP_SELF"] ?>?vizurl=" + $.URLEncode(url);
        
        if(path == "") {
            $('#loadedViz').html('');
        }
        else {
            var dir = path.split("/").slice(-2,-1);
            $('#loadedViz').html('<div style="text-align: center; font-size: 20px;">'
                + 'showing <b>' + vizName +'</b> for <b>' + niceFileName + '</b> in <b>' + dir +'</b> '
                + '</div>');
        }
        
        $('#exportTD').html(' ' 
            + '<input type="text" value="'+ superURL +'" /> <br />'
            + '<a href="#" onclick="doExport()" id="export">export</a>');
    }
    
});
</script>
</head>
<body>
<table border='0' cellpadding="2" width="100%">
<tr>
<td width="250"><img src='logo.png' id="logo"></td>
<td id='loadedViz'></td>
<td id='exportTD' width="250" align="right"></td>
</table>

<ul id="browser" class="filetree popupBox">
<div align="center" style="margin-top: 50px;">Loading...</div>
</ul>
<form method="POST" action="export.php" id="exportForm"><input name="svg" type="hidden" id="exportContents"></form>

<iframe id="contentsDiv" width="100%" height="100%%" style="border: 1px solid white" <?=(isset($_GET['vizurl']) ? 'src="'.$_GET['vizurl'].'"' : '');?>>
</iframe>

</body>
</html>
