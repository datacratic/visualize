<?
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
include("pathcheck.php");

$p = $_GET["param"];
if(!strpos($p, "|")) {
    if(pathIsAllowed($p)) {
        include($p);
    }
    else {
        echo "Security Error: can't access this path! <br /> " . $p;
        exit(0);
    }
}
else {
    $files = explode("|", $p);
    
    echo "this.data = {\n";
    foreach($files as $f) {
        if($f != ""){
            echo "\"" . array_pop(explode("/", $f)) . "\": new (function(){\n";
            if(pathIsAllowed($f)) {
                include($f);
            }
            else {
                echo "Security Error: can't access this path! <br /> " . $f;
                exit(0);
            }
            echo "\n})(),\n";
        }
    }
    echo "};";
}
?>