/** Config for individual dev environment **/

namespace = module.exports ? module.exports : window.CONFIG
namespace = {
	baseURI : '', //base URI for server ex. http://localhost
	// PhoneGap Build
	PGB : { 
		username : '',
		password : '',
		// can be found at http://build.phonegap.com
		appID : '326574846586549569'
	}
}