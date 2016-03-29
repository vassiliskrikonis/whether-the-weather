function showError(error)
{
	console.log(error);
}

function save(key, value)
/* check if localStorage is available then
 * save key, value pair
 */
{
	if(isLocalStorageAvailable())
		localStorage.setItem(key, value);
	else
		return false;
}

function load(key)
{
	if(isLocalStorageAvailable())
		return localStorage.getItem(key);
	else
		return false;
}

function isLocalStorageAvailable()
{
	try {
		var storage = window['localStorage'],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e) {
		return false;
	}
}
