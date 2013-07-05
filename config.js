/** Config for individual app environments **/

/** Null Empire PhoneGap Dev Environment

*** PhoneGap -> Server ***
1. PhoneGap App -> Local Dev Server (ex. 192.168.1.2) only works in our office
2. PhoneGap App -> Staging Server on Heroku (all testers can test)
3. PhoneGap App -> Prod Server on Heroku (in front of the world)
**/

namespace = module.exports ? module.exports : window.CONFIG
namespace = {
	baseURI : '', //base URI for server
	env : '',
	// PhoneGap Build
	PGB : { 
		username : '',
		password : '',
		// can be found at http://build.phonegap.com
		devAppID : '',
		stagingAppID : '',
		prodAppID : ''
	}
}