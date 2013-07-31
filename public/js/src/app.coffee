# Application class that instantiates everything
window.Namespace = window.Namespace ? {}
	
class App

	constructor : () ->

		self = @
		@baseURI = window.CONFIG.baseURI
		@attachEvents()

	renderViews : () ->
		$body = $('body')
			
	isAuthenticated : () ->
		if $.jStorage.get('privateKey')
			return true
		else
			return false

	preFlight : (cb) ->
		cb = cb ? () ->
		
		# Send a post request to your web-service
		# Pre-flight request to gain access to web server
		# uses CORS
		@request {
			url : @baseURI + '/preflight'
			data : {}
			type : 'get'
			success : cb
			error : (err) ->
				console.log err
				console.error "ERROR : ", err.responseText
		}
	
	get : (url, data, cb) ->
		cb = cb ? () ->
		data = data ? {}
		self = @

		@hash data, (data) ->
			self.request {
				url : url
				data : data
				type : 'get'
				success : cb
				error : (err) ->
					console.log err
					console.error "ERROR : ", err.responseText
			}


	post : (url, data, cb) ->
		cb = cb ? () ->
		data = data ? {}
		self = @

		@hash data, (data) ->
			self.request {
				url : url
				data : data
				type : 'post'
				success : cb
				error : (err) ->
					console.log err
					console.error "ERROR : ", err.responseText
			}


	hash : (data, cb) ->
		cb = cb ? () ->
		d = {}
		privateKey = $.jStorage.get('privateKey') ? CryptoJS.MD5(data.password).toString()
		publicKey = $.jStorage.get('publicKey') ? data.username
		
		if data.password
			delete data.password
		
		d.h = CryptoJS.HmacSHA256(JSON.stringify(data), privateKey).toString()
		d.data = data
		d.email = publicKey
		cb(d)

	request : (options) ->
		$.ajax options

	attachEvents : () ->

	registerPartials : ->
		for i of Handlebars.templates			
			key = i.split('-')[0]
			if key is 'partial'
				Handlebars.registerPartial(i.split('-')[1], Handlebars.templates[i])

	render : (view) ->
		$('[data-role="page"]').removeClass 'show'
		$('[view="'+view+'"]').addClass 'show'
		nav = $('[data-role="nav"]')
		nav.find('[trigger]').removeClass 'selected'
		nav.find('[trigger="'+view+'"]').addClass 'selected'

window.Namespace.App = App


