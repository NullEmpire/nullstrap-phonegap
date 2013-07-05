/** Config for individual app environments **/

/** Null Empire PhoneGap Dev Environment

*** PhoneGap -> Server ***
1. PhoneGap App -> Local Dev Server (ex. 192.168.1.2) only works in our office
2. PhoneGap App -> Staging Server on Heroku (all testers can test)
3. PhoneGap App -> Prod Server on Heroku (in front of the world)

*** PhoneGap Promotion Process ***
Once a feature or bug is complete, replace public folder in staging app with dev version.
The same process goes for staging to prod.

**/

window.CONFIG = {
	baseURI : '', //base URI for server
	env : '',
	PGB : {
		username : '',
		password : '',
		// can be found at http://build.phonegap.com
		devAppID : '',
		stagingAppID : '',
		prodAppID : ''
	}
}