window.Namespace = window.Namespace ? {}

class Router

	constructor : () ->
		self = @
		@currentPage = false
		@container = $('#main')
		$(window).on 'hashchange', (e) ->
			self.route.call(self, e)		

	route : (e) ->
		self = @
		hash = window.location.hash
	
		if hash is "#home"
			page = Handlebars.templates['home']()
			@render page
		else 
			page = Handlebars.templates['home']()
			@render page

	render : (page, cb) ->
		cb = cb ? () ->
		page = $(page)

		@container.append page

		if not @currentPage
			page.addClass 'show'
			@currentPage = page
			return

		@currentPage.one 'webkitTransitionEnd', (e) ->
			$(e.target).remove()

		# Force reflow. More information here: http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
		@container[0].offsetWidth
		page.addClass 'show'
		@currentPage.removeClass 'show'
		@currentPage = page
		cb()

window.Namespace.Router = Router