var fs = require("fs");
var path = require("path");
var json5 = require("json5");

var r_abs_path = /^(?:file:\/)?\//

function extend(target, source){
    for(var k in source){
        if (target.hasOwnProperty(k)){
            if (isObject(target[k]) && isObject(source[k])){
                extend(target[k], source[k])
            } else {
                target[k] = source[k]
            }
        } else {
            target[k] = source[k];
        }
    }
}

function isObject(k){
    if (k === undefined || k === null) return false;
    return Object.prototype.toString.call(k) == "[object Object]";
}

function isArray(k){
    if (k === undefined || k === null) return false;
    return Object.prototype.toString.call(k) == "[object Array]";
}

function isString(k){
    return typeof(k) == "string";
}


function merge_conf(conf, file_stacks, basepath){

    function merge_a_key(key, base_conf){
        var val = base_conf[key];
        if (isObject(val) || isArray(val)){
            //尝试展开合并
            base_conf[key] = merge_conf(val, file_stacks, basepath);
        }
    }

    function parse_sub(_include_conf, _val){
        if (_val == ""){
            throw new Error("include command shouldn't contain an empty string value");
        }
        if (!r_abs_path.test(_val)){
            _val = path.join(basepath, _val);
        }
        var sub_conf = evalParse(_val, file_stacks);
        _include_conf.push(sub_conf);
    }

    //处理每个子元素
    if (isObject(conf)){
        var include_conf = [], has_include;
        for (var key in conf){
            var val = conf[key]
            if (key == "include") {
                has_include = true;

                if (isString(val)){
                    parse_sub(include_conf, val);
                } else if (isArray(val)){
                    for (var j = 0; j < val.length; j++){
                        parse_sub(include_conf, val[j]);
                    }
                } else {
                    //直接忽略其它值类型?给个提示..
                }

            } else {
                merge_a_key(key, conf);
            }
        }
        if (has_include){
            var includes = conf["include"];
            delete conf["include"]
        }
        if (include_conf.length > 0){
            //用include文件中的key覆盖同级key
            for (var i = 0; i < include_conf.length; i++){
                if (isObject(include_conf[i])){
                    extend(conf, include_conf[i]);
                } else {
                    //console.notice("include a file but parse result is not object. ==> " + includes[i]);
                }
            }
        } else {
            //其它任何形式都是没有意义的
        }
    } else if (isArray(conf)){
        for (var i = 0; i < conf.length; i++){
            merge_a_key(i, conf);
        }
    }
    return conf;
}

function print_dependence_stack(arr){
    for(var i = 0; i < arr.length; i++){
        var str = i > 0 ? "==>" : "";
        console.log(str + '\x1B[31m[%s]\x1B[39m ', arr[i]);
    };
}
function evalParse(file_abs_path, file_stacks){
    if (!fs.existsSync(file_abs_path)){
        return null;
    }

    for (var i = file_stacks.length - 1; i >= 0; i--){
        if (file_stacks[i] == file_abs_path){
            file_stacks.push(file_abs_path);
            print_dependence_stack(file_stacks);
            throw new Error("file cycle dependence!");
        }
    }
    file_stacks.push(file_abs_path);
    var fileContent = fs.readFileSync(file_abs_path, "utf-8");
    //eval("var conf=" + fileContent);
    var conf = json5.parse(fileContent);
    conf = merge_conf(conf, file_stacks, path.dirname(file_abs_path));
    file_stacks.pop();
    return conf;
}

exports.parse = function(file_path){
    var file_stacks = [];
    return evalParse(file_path, file_stacks);
};

