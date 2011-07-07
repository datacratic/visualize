#Recoset's Dataviz Framework


##What does it do? How does it work? How do I run it?

This is a fairly simple web application that is meant to make it easy to match up JSON data files with Protoviz visualization code and view the result. Installation is simple: just copy the files to a web server that knows PHP and read the 'Security Note' below. To use it, put some data files in the 'data' directory and some visualization code in the 'viz' directory and follow the naming conventions: files in 'data' named X-Y.* will be visualizable using visualizations called Z-Y.js or Z-Y.coffee. See the sample data and viz directories in this repo.

##Demo and more info


There is a demo installation of this sytem at http://visualize.recoset.com/ and a blog post at TBD.

##Security Note


The purpose of this system is to allow you to visualize data on the machine on which it is running. This poses a certain security risk, especially if you install this on a public-facing server. As such, the `pathcheck.php` file allows you to restrict the path under which this app will serve up files. By default it is configured to serve up data files in its own 'data' directory.
