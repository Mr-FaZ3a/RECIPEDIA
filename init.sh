#!/bin/bash

source "$PWD/.venv/bin/activate"

declare -i port=1000

port_validation(){
	local port=$1
	
	if sudo lsof -i :$port > /dev/null 2>&1 ; then
		echo "trying another port"
		return $?
	else
		return $?
	fi
}

while port_validation $port ; [ $? -ne 1 ]
do
	((port++))
done

echo "WARNING : port $port will be in use"

flask run --port=$port --debug
