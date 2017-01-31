#!/bin/bash

for i in lockit*/postprocessed/*/*.xliff
do
	echo $i
	node hashfix $i
	mv ${i}-new $i
done
