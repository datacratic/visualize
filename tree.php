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
$datapath = $_GET["path"];
if(!pathIsAllowed($datapath))
{
    echo "Security Error: can't access this path! <br /> " . $datapath;
    exit(0);
}

foreach (glob("viz/*-*") as $filename) {
    $path_parts = pathinfo($filename);
    list($vizName, $fileType) = split('-',$path_parts["filename"], 2);
    $vizTypes[$fileType][] = $vizName;
}

foreach (glob("viz/multi/*-*") as $filename) {
    $path_parts = pathinfo($filename);
    list($vizName, $fileType) = split('-',$path_parts["filename"], 2);
    $multiVizTypes[$fileType][] = $vizName;
}
?>

<script language="javascript">

    $("#treeLoader").click(function(e) {
        e.preventDefault();
        $("#treeLoader").html('...')
        $("#browser").load("tree.php?path=" + $("#datapath").val(),
             function(){ $("#browser").treeview({collapsed:true});});
     });
     
     $(".multicontrol").hide();
     $(".multicheckbox").hide();
     
     $("a.multishow").click(function(){ 
        $(".multicheckbox-"  + this.id.split("-")[1]).show(); 
        $("#multicontrol-" + this.id.split("-")[1]).show(); 
     });
     
     
     $(".multibutton").click(function() {
        var pieces = this.id.split("-");
        var vizname = "multi/" + pieces[1];
        var filetype = pieces[2]; 
        var files = "";
        $("input.multi:checkbox").filter(":checked").each(function(){ files += $(this).val() + "|"; });
        $.displayGraph("", files, vizname, filetype, "multi");
     });

</script>
<div align="center">
<form>
<input type="text" value="<?= $datapath ?>" id="datapath" size="30">
<button id="treeLoader" style="font-size: 16px">⟳</button>
</form>

<? foreach($multiVizTypes as $type => $vizArray) { ?>
<div id="multicontrol-<?= $type ?>" class="multicontrol">
    <? foreach($vizArray as $viz) { ?>
        <button id="multishow-<?=$viz?>-<?=$type?>" class="multibutton">multi/<?=$viz?></button>
    <? } ?>
</div>
<? } ?>

<hr />
</div>

<?
function dir_contents_recursive($dir) {
    $h = array();
    $iter = new DirectoryIterator($dir);
    foreach( $iter as $item ) {
        // make sure you don't try to access the current dir or the parent
        if ($item != '.' && $item != '..') {
            if( $item->isDir() ) {
                $h[$item->getFilename()] = dir_contents_recursive("$dir/$item");
            } else {
                if(strstr($item->getFilename(), "."))
                    array_push($h, $item->getFilename());
            }
        }
    }
    asort($h);
    return $h;
}

function plural($num) {
    if ($num != 1)
        return "s";
}

function getRelativeTime($date) {
    $diff = time() - $date;
    if ($diff<60)
        return $diff . " second" . plural($diff) . " ago";
    $diff = round($diff/60);
    if ($diff<60)
        return $diff . " minute" . plural($diff) . " ago";
    $diff = round($diff/60);
    if ($diff<24)
        return $diff . " hour" . plural($diff) . " ago";
    $diff = round($diff/24);
    if ($diff<7)
        return $diff . " day" . plural($diff) . " ago";
    $diff = round($diff/7);
    if ($diff<4)
        return $diff . " week" . plural($diff) . " ago";
    return "on " . date("F j, Y", $date);
}

function process_level($data, $prefix) {
    global $vizTypes;
    global $multiVizTypes;
            
    foreach ($data as $key => $value) {
        if (!is_array($value)) {
            $modTime = getRelativeTime(filemtime($prefix.$value));
            
            $path_parts = pathinfo($value);
            list($fileType, $fileName) = split('-',$path_parts["filename"], 2);
            
            $niceFileName = str_ireplace("_", " ", $fileName);
            echo '<li><span class="file" title="' . $modTime . '">';
            if(isset($multiVizTypes[$fileType])){
                echo '<label class="multicheckbox multicheckbox-' . $fileType . '"> <input type="checkbox" class="multi" id="'.$value. '" value="' . $prefix.$value . '"> </label>';
            }
            echo $niceFileName.'</span><ul><li> ';
            $first = true;
            foreach($vizTypes[$fileType] as $vizname) {
                if($first) {$first=false;}
                else{ echo ", ";}
                echo '<a href="#" onclick="$.displayGraph(\''.$prefix.'\',\''.$value.'\', \''.$vizname.'\', \''.$fileType.'\', \''.$niceFileName.'\')">'.$vizname.'</a>';
            }
            if(isset($multiVizTypes[$fileType])){
                echo ', <a href="#" class="multishow" id="multishow-'.$value. '">multi</a>';
            }
            echo '</li></ul></li>';
        }
    }

    foreach ($data as $key => $value) {
        if (is_array($value)) {
            echo '<li><span class="folder">'.$key.'</span>';
            if (count($value)>0) {
                echo '<ul>';
                process_level($value, $prefix.$key.'/');
                echo '</ul>';
            }
            echo '</li>';
        }
    }
}
process_level(dir_contents_recursive($datapath), $datapath . "/");

?>
