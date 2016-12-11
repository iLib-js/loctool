sed 's@<seg-source>.*</seg-source>@@' $* | sed 's/<mrk[^>]*>//g' | sed 's@</mrk>@@g'
