#!/usr/bin/env bash

display_help(){
 cat <<-EOF

 Usage: gmfe publish -u youname -m module

 Commands:
    -u, --user      name who published

 Options:
    -m, --module    module which will run after online

EOF
}

preview(){
    git diff
}


if test "$1" == "-h"; then
    display_help; exit ;
elif test "$1" == "publish" && test "$2" == "-u" && test "$3"; then
    echo "yes";
    preview
else
    echo "no"
#    display_help
fi