#!/usr/bin/env bash

set -e

BashDir=$(cd "$(dirname $BASH_SOURCE)" && pwd)
eval $(cat "$BashDir/conf.sh")
if [[ "$Command" == "" ]];then
    Command="$0"
fi

function help(){
    echo "run project"
    echo
    echo "Usage:"
    echo "  $Command [flags]"
    echo
    echo "Flags:"
    echo "  -c, --code          build go code before running"
    echo "  -s, --static        build static before running"
    echo "  -h, --help          help for $Command"
}

ARGS=`getopt -o hc --long help,code -n "$Command" -- "$@"`
eval set -- "${ARGS}"
code=0
while true
do
    case "$1" in
        -h|--help)
            help
            exit 0
        ;;
        -c|--code)
            code=1
            shift 1
        ;;
        --)
            shift
            break
        ;;
        *)
            echo Error: unknown flag "$1" for "$Command"
            echo "Run '$Command --help' for usage."
            exit 1
        ;;
    esac
done

if [[ $code != 0 ]];then
    "$BashDir/go.sh"
fi
cd "$Dir/bin"
args=(
    ./"$Target" daemon
)

exec="${args[@]}"
echo $exec
eval "$exec"
