# Description

Experimental single touch gesture browser extension. My main focus is Fenix, that is Firefox on Android.

Detection of gestures isn't really that reliable yet.

# Development

* `make change_to_firefox`
* Install web-ext so that web-ext executable is in the PATH.
* Change `firefox-bin` variable in Makefile to point to a Firefox binary you want to use.
* Change `ff-profile` variable in Makefile to an existing Firefox profile you want to use.
* `make run` or `make run_android`

# License

GPL3.
