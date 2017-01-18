
for project in ht-androidapp ht-iosapp ht-webapp12 feelgood-video-chats_lib
do
	echo Processing project $project ...

ls lockit*/postprocessed/*/${project}*

	echo 
	cat $(ls lockit*/postprocessed/*/${project}*) | awk -f concatenate.awk > current/${project}.xliff
	
# for i in lockit[1-7] lockit5a lockit6a lockit6b
#	for i in lockit*
#	do
#		echo "  $i"
#		cd $i/postprocessed
#		
#		X=$(ls es/${project}* zh/${project}*)
#		if [ "$X" != "" ]
#		then
#			echo "    Concatenating postprocessed files"
#			cat es/${project}* zh/${project}* | awk -f ../../concatenate.awk > ${project}.xliff
#			xmllint --noout ${project}.xliff
#		fi
#		cd ../..
#	done
#
#	echo "  Concatenating lockits"
#	cat lockit[1-8]*/postprocessed/${project}.xliff | awk -f concatenate.awk > current/${project}.xliff
done

