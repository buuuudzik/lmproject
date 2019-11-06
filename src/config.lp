<?
require('apps')
require('json')
_SCRIPTNAME = 'LM Project'
_CONFIGKEY = 'app:lmproject:config';
requestMethod = ngx.var.request_method

if requestMethod == "GET" then
  local config = storage.get(_CONFIGKEY, {
    todos = {},
    warnings = {},
    logs = {}
  })
  print(json.encode(config))
elseif requestMethod == "POST" then
  upload()

  local config = ngx.var.request_body

  if config then
    config = json.decode(config)
    if config then
      local hasTodos = type(config.todos) == "table"
      local hasWarnings = type(config.warnings) == "table"
      local hasLogs = type(config.logs) == "table"
      
      if hasTodos and hasWarnings and hasLogs then
      storage.set(_CONFIGKEY, {
        todos = config.todos,
        warnings = config.warnings,
        logs = config.logs
      })
      end
    end
  end

  write("OK")
end


?>