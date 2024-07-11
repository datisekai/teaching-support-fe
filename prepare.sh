#!/bin/bash
function makeFixedVersion {
	version="0.0.0"
	search='\(\"version\":[[:space:]]*\"\).\+\(\"\)'
	replace="\1${version}\2"
	
	sed -i "1,/${search}/s/${search}/${replace}/" "$1"
}


makeFixedVersion $1