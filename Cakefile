fs = require 'fs'
flour = require 'flour'
pgb = require 'phonegap-build-api'
async = require 'async'
{print} = require 'sys'
{log, error} = console; print = log
{spawn, exec} = require 'child_process'

# default the environment to dev
env = 'dev'

run = (name, args...) ->
  
  if cb is false
    cb = () ->

  cb = cb ? () ->

  proc = spawn(name, args)
  proc.stdout.on('data', (buffer) -> print buffer if buffer = buffer.toString().trim())
  proc.stderr.on('data', (buffer) -> error buffer if buffer = buffer.toString().trim())
  proc.on 'exit', (status) ->
    process.exit(1) if status isnt 0
    cb()

command = (cb, name, args...) ->
  
  if cb is false
    cb = () ->

  cb = cb ? () ->

  proc = spawn(name, args)
  proc.stdout.on('data', (buffer) -> print buffer if buffer = buffer.toString().trim())
  proc.stderr.on('data', (buffer) -> error buffer if buffer = buffer.toString().trim())
  proc.on 'exit', (status) ->
    process.exit(1) if status isnt 0
    cb()

readJSON = (path) ->
  return fs.readFileSync path, 'utf8'

pgbConfig = JSON.parse readJSON './config/pgb.json'

task 'system', 'Install system dependencies ', () ->

  # install Dependencies (Run in sudo)
  async.series [
    (cb) -> 
      run 'gem', 'install', 'terminal-notifier'
      cb()
    ,
    (cb) -> 
      run 'npm', 'install', '-g', 'bower'
      cb()
    ,
    (cb) -> 
      run 'npm', 'install', '-g', 'banshee'
      cb()
    ,
    (cb) ->  
      run 'npm', 'install', '-g', 'stylus'
      cb()
    ,
    (cb) -> 
      run 'npm', 'install', '-g', 'handlebars'
      cb()
    ,
    (cb) -> 
      run 'npm', 'install', '-g', 'uglify-js'
      cb()
  ]

task 'install', 'Install dependencies ', () ->

  async.series [
      (cb) -> 
        run 'npm', 'install'
        cb()
      ,
      (cb) -> 
        run 'bower', 'install'
        cb()
  ]

task 'dev', 'Watch src/ for changes, compile, then output to lib/ ', () ->

  flour.minifiers.disable 'js'
  # flour.silent true

  # invoke 'build:styles'
  # invoke 'build:coffeescript'

  # watch vendor js includes
  run 'banshee','public/js/_includes.js:public/js/vendor.js'

  # watch vendor css includes
  run 'banshee','public/css/_includes.css:public/css/vendor.css'

  run 'coffee', '-o', 'public/js/lib/', '-wc', 'public/js/src/'

  # stylus
  run 'stylus','-o', 'public/css/lib', '-w', 'public/css/src'

  # pre-compile client-side templates
  templatesDir = 'public/js/templates/src'
  compileHandlebars = (template) ->
    # pre-compile client-side templates
    run 'handlebars', templatesDir, '-f', 'public/js/templates/templates.js'

   # watch client side templates
  templates = fs.readdirSync templatesDir
  for i in [0...templates.length]
    template = templatesDir + '/' + templates[i]
    do (template) ->
      fs.watch template, (curr, prev) ->
        compileHandlebars()

  compileHandlebars()

  # Write the config files for dev
  run 'cake', '-e', 'dev', 'build'

  run 'node', 'server.js'


# Example cake -e staging build
option '-e', '--env [ENV]', 'environment to build'
task 'build', 'Build for production PhoneGap App', (options) ->

  env = options.env
  console.log "Building environment : #{env}"

  async.series [

    (cb) ->

      # write the proper JS config for current environment
      fs.readFile "env/#{env}/config.js", 'utf8', (err, data) ->
        
        if err
          console.log err 
        
        fs.writeFile 'config/config.js', '/** File Generated by Build System **/\n' + data, (err) ->
          if err
            console.log err
          cb()
    ,
    (cb) ->

      # write the correct config.xml file
      fs.readFile "env/#{env}/config.xml", 'utf8', (err, data) ->
        if err
          console.log err 
        
        fs.writeFile 'config.xml', '<!-- File Generated by NullStrap Build System -->\n' + data, (err) ->
          if err
            console.log err
          cb()
    ,
    (cb) ->

      if env isnt 'dev'

        # commit code to github repo
        async.series [
          (cb) ->
            command cb, 'git', 'add', '-A'
          ,
          (cb) ->
            command cb, 'git','commit', '-m', '"Building '+env+' PhoneGap app"'
          ,
          (cb) ->
            command cb, 'git','push'
          ,(cb) ->
            buildPhoneGap(cb)

        ], () ->
          cb()
      else
        cb()

  ], () ->
    console.log "Done building environment configuration."


# Tell http://build.phonegap.com to build the app

buildPhoneGap = (cb) ->
  cb = cb ? () ->

  build = (api, appID) ->

      console.log "Refreshing App on build.phonegap.com ..."

      # update PGB from Github
      api.put "/apps/#{appID}}", {form: {data: {pull: true}}}, (e , data) ->
        
        console.log 'Pull Error : ', e if e
        # Build PGB App
        api.post "/apps/#{appID}/build/", {form: {data: {platforms: ['ios', 'android']}}}, (e, data) ->
          console.log ' Build Error : ', e if e
          console.log "Done refreshing app on ", new Date()
          cb()
  
  pgb.auth { username : pgbConfig.username, password : pgbConfig.password }, (e, api) ->
    
    if pgbConfig.env[env]?.id?
      build(api, pgbConfig.env[env].id)

    # if the PGB App doesn't exist, create it
    else if env isnt 'dev'
      options = {form : {data : {create_method : 'remote_repo', private : true, repo : pgbConfig.repo, title : pgbConfig.env[env].title}}}

      if env isnt 'prod'
        options.form.data.hydrates = true

      api.post "/apps", options, (e, response) ->
        if e
          console.log e
        else
          # update config.js to have PGB App ID
          console.log response
          data = pgbConfig
          data.env[env].id = response.id

          fs.writeFile "./config/pgb.json", JSON.stringify(data), (err) ->
            if err
              console.log err
            
            build(api, response.id)






