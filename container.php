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

<html>
  <head>
    <title>Dataviz Container</title>
    <script type="text/javascript" src="lib/jquery-1.5.2.min.js"></script>
    <script type="text/javascript" src="lib/jquery-ui-1.8.11.custom.min.js"></script>
    <script type="text/javascript" src="lib/protovis-r3.2.js"></script>
    <script type="text/javascript" src="lib/coffee-script.js"></script>
    <script type="text/javascript" src="wrapper.php?param=<?=$_GET['data'];?>"></script>
    <style type="text/css">
        body {margin: 0;}
    </style>
  </head>
  <body>
  <div id="test">
  <? if( is_file("viz/" . $_GET['graph'] . ".js") ) { ?>
    <script type="text/javascript" src='<?="viz/" . $_GET['graph'];?>.js'></script>
  <? } ?>
  <? if( is_file("viz/" . $_GET['graph'] . ".coffee") ) { ?>
    <script type="text/coffeescript" src='<?="viz/" . $_GET['graph'];?>.coffee'></script>
  <? } ?>
  </div>
  </body>
</html>
