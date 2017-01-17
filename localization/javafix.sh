for i in */postprocessed/*/ht-androidapp-*
do
	echo $i
	node javafix.js $i
	mv ${i}-new $i
done
