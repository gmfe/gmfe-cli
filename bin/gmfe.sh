#!/usr/bin/env bash

abs_bin_path=$(cd `dirname $0`; pwd)
app_root_path=$(cd "$abs_bin_path/.."; pwd)

node $app_root_path/js/index.js $@