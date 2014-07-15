#!/bin/bash

if [ $# -eq 0 ]
  then
  	targetBrowser=chromium-browser
  else
  	targetBrowser=$1
fi

#deployFolder="~/Dev/Software/Libs/apache-tomcat-7.0.54/webapps/MejorUAPhongapAsWeb"
deployFolder="/home/mint-mesa/workspace/.metadata/.plugins/org.eclipse.wst.server.core/tmp0/wtpwebapps/MejorUA.api"

targetURL="http://localhost:8080"

echo Deploying Phonegap app to:
echo -e '\t'$deployFolder
echo

#rm -rf $deployFolder
#mkdir $deployFolder
ls -1 $deployFolder | grep -v 'META-INF\|WEB-INF' | xargs rm -rf
echo -e '\tDeleted original deploy except META-INF and WEB-INF'

cp -r ./www/* $deployFolder
echo -e '\tDeployed Phonegap app'

echo

echo Launching webapp with $targetBrowser at $targetURL
$targetBrowser $targetURL > /dev/null 2>&1

