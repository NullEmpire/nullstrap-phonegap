fs = require 'fs'
flour = require 'flour'
growl = require 'growl'
{print} = require 'sys'
{log, error} = console; print = log
{spawn, exec} = require 'child_process'

run = (name, args...) ->
  proc = spawn(name, args)
  proc.stdout.on('data', (buffer) -> print buffer if buffer = buffer.toString().trim())
  proc.stderr.on('data', (buffer) -> error buffer if buffer = buffer.toString().trim())
  proc.on('exit', (status) -> process.exit(1) if status isnt 0)

task 'system', 'Install system dependancies ', () ->

  # install Dependencies (Run in sudo)
  run 'gem', 'install', 'terminal-notifier'
  run 'npm', 'install', '-g', 'bower'
  run 'npm', 'install', '-g', 'banshee'
  run 'npm', 'install', '-g', 'stylus'
  run 'npm', 'install', '-g', 'handlebars'
  run 'npm', 'install', '-g', 'uglify-js'

task 'install', 'Install dependancies ', () ->

  run 'npm', 'install'
  run 'bower', 'install'

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
