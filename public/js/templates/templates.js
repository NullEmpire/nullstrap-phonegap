(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['index'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "";


  return buffer;
  });
templates['login'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this;


  stack1 = self.invokePartial(partials.header, 'header', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n<div data-role=\"page\" id=\"login-view\" view=\"login\">\n	<h2>Login</h2>\n	<form id=\"login-form\">\n		<ul>\n			<li><input type=\"email\" id=\"email\" placeholder=\"email\" /></li>\n			<li><input type=\"password\" id=\"password\" placeholder=\"password\" /></li>\n			<li><input type=\"submit\" id=\"submit\" /></li>\n		</ul>\n	</form>\n</div>";
  return buffer;
  });
templates['partial-header'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<header data-role=\"header\">\n	<h1>Hello!</h1> \n</header>";
  });
})();