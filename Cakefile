fs = require 'fs'
flour = require 'flour'
growl = require 'growl'
pgb = require 'phonegap-build-api'
async = require 'async'
{print} = require 'sys'
{log, error} = console; print = log
{spawn, exec} = require 'child_process'

run = (name, args...) ->
  proc = spawn(name, args)
  proc.stdout.on('data', (buffer) -> print buffer if buffer = buffer.toString().trim())
  proc.stderr.on('data', (buffer) -> error buffer if buffer = buffer.toString().trim())
  proc.on('exit', (status) -> process.exit(1) if status isnt 0)

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
  flour.silent true
  
  watch 'public/js/lib', -> invoke 'combine'  

  # watch js includes
  run 'banshee','public/js/_includes.js:public/js/vendor.js'

  # watch css includes
  run 'banshee', 'public/css/_includes.css:public/css/vendor.css'

  # client side coffeescript files
  run 'coffee', '-o', 'public/js/lib/', '-wc', 'public/js/src/'

  # stylus
  run 'stylus','-o', 'public/css/lib', '-w', 'public/css/src'

  # pre-compile client-side templates
  templatesDir = 'public/js/templates/src'
  compileHandlebars = (template) ->
    
    run 'handlebars', templatesDir, '-f', 'public/js/templates/templates.js'
    run 'uglifyjs', 'public/js/templates/templates.js', '-o','public/js/templates/templates.js'
    if template?
      growl 'Template Updated : ' + template

  # watch client side templates
  templates = fs.readdirSync templatesDir
  for i in [0...templates.length]
    template = templatesDir + '/' + templates[i]
    do (template) ->
      fs.watchFile template, (curr, prev) ->
        if +curr.mtime isnt +prev.mtime
          compileHandlebars(template)

  compileHandlebars()


task 'combine', 'Automatically combine files for dev', () ->
  
  paths =
    models : 'public/js/lib/models'
    views : 'public/js/lib/views'
  
  for i of paths
    d = []
    files = fs.readdirSync paths[i]
    for j in [0...files.length]
      d.push paths[i] + '/' + files[j]

    bundle d, 'public/js/lib/' + i + '.js'

option '-e', '--env [ENV]', 'environment to build'
task 'build', 'Build for production PhoneGap App', (options) ->
  env = options.env
  config = {}
  console.log "Building environment : #{env}..."

  async.series [
    (cb) ->
      # write the proper JS config for current environment
      fs.readFile "env/#{env}/config.js", 'utf8', (err, data) ->
        
        config = require "./env/#{env}/config"

        if err
          console.log err 
        
        fs.writeFile 'config.js', '/** File Generated by Build System **/\n' + data, (err) ->
          if err
            console.log err
          cb()
    ,
    (cb) ->
      # write the correct config.xml file
      fs.readFile "env/#{env}/config.xml", 'utf8', (err, data) ->
        if err
          console.log err 
        
        fs.writeFile 'config.xml', '/** File Generated by NullStrap Build System **/' + data, (err) ->
          if err
            console.log err
          cb()
    ,
    (cb) ->
      # commit code to github repo
      exec 'git add .', (err) ->
        exec 'git commit -m "building production PhoneGap app"', () ->
          # build the phonegap app
          console.log 'configy', config
          buildPhoneGap(config.PGB.appID, cb)
  ], () ->
    console.log "Done."


buildPhoneGap = (appID, cb) ->
  cb = cb ? () ->

  pgb.auth { username : config.PGB.username, password : config.PGB.password }, (e, api) ->

    api.get "/apps/#{appID}", (err, app) ->

      console.log "Refreshing #{app.title}..."

      api.put "/apps/#{app.id}}",options = {form: {data: {pull: true}}}, (e , data) ->
        
        console.log 'Pull Error : ', e if e

        api.post "/apps/#{app.id}/build/", {form: {data: {platforms: ['ios', 'android','windows']}}}, (e, data) ->
          console.log ' Build Error : ', e if e
          console.log "Done refreshing app on ", new Date()
          cb()


