<?
require('apps')
_SCRIPTNAME = 'LM Project'
_CONFIGKEY = 'app:lmproject:config';

requestMethod = ngx.var.request_method

if requestMethod == 'POST' then
    upload()
    require('json')
    local requestType = getvar('request_type')

    if requestType == "backup" then
        local config = getvar('file')

        if #config > 0 then
            config = json.decode(config)
            storage.set(_CONFIGKEY, config)
        else return print('not saved') end
    else return print('not saved') end
    print('saved')
end

?>