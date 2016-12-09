grep '<source' $* | sed 's/^.*<source>//' | sed 's@</source>.*$@@'
