#!/usr/bin/env bash

echo "run after_online"

module_command = $1
if [[ "x$module_command" = "x" ]]; then
  exit 0
elif [[ "$module_command" = "web" ]]; then
  echo "do web module";
  exit $?
else
  echo "unknown module command: $module_command"
  exit 0
fi


