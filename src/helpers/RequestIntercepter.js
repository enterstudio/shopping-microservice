/**
 * Created by kaile on 4/19/17.
 */

import httpStatus from 'http-status';
import Constants from './Const';
import Crypto from 'crypto';

module.exports = function(req, res, next) {
	const api_path = req.originalUrl.split('?')[0];

	let isUseGateway = process.env.IS_USE_GATEWAY || "false";
	//bypass for callbacks coming from shopify
	if(api_path === '/api/v1/shopping/products/create/webhook'
		|| api_path === '/api/v1/shopping/products/update/webhook'
		|| api_path === '/api/v1/shopping/products/delete/webhook') {
		req.user_id = req.headers['on-behalf-of-user'] || 123;
		req.app_id = req.headers['x-api-key'] || 'unknown_app_id';
		next();
		return;
	}

    req.checkHeaders('x-api-key', 'missing x-api-key in headers').notEmpty();
    req.checkHeaders('on-behalf-of-user', 'missing on-behalf-of-user in headers').notEmpty();

    if(isUseGateway == "false"){
		req.getValidationResult().then(result => {
			if (!result.isEmpty())
			{
				res.status(httpStatus.BAD_REQUEST).send({
					"message": 'One or more headers are invalid/missing',
					"details": result.array()
				});
				return;
			}
			else {
				req.user_id = req.headers['on-behalf-of-user'] || 123;
				req.app_id = req.headers['x-api-key'] || 'unknown_app_id';
				next();
			}
		});

	}else{
		req.checkHeaders('x-vendor-key', 'missing x-vendor-key in headers').notEmpty();
		req.checkHeaders('service-api-key', 'missing service-api-key in headers').notEmpty();

		req.getValidationResult().then(result => {
			if (!result.isEmpty()) {
			res.status(httpStatus.BAD_REQUEST).send({
				"message": 'Missing user validation signatures',
				"details": result.array()
			});
		}
		else {
			const service_api_key = req.headers['service-api-key'];
			const vendor_key = req.headers['x-vendor-key'];
			const vendor = Constants.VendorConfig[service_api_key];
			if (vendor) {
				const service_shared_secret = vendor.service_shared_secret;
				let vendorKeySplits = vendor_key.split(':');
				if(!(vendorKeySplits.length == 3)) {
					console.error('Invalid security headers: after split the headers did not gave 3 strings');
					res.status(httpStatus.UNAUTHORIZED).send({
						"message": 'Invalid Security Headers.'
					});
					return;
				}
				if(!(vendorKeySplits[0] === 'x')){
					console.error('Invalid security headers: header did not start with x:t:h.');
					res.status(httpStatus.UNAUTHORIZED).send({
						"message": 'Invalid Security Headers.'
					});
					return;
				}

				const timestamp = vendorKeySplits[1];
				const vendorHash = vendorKeySplits[2];
				let hashString = api_path + service_api_key + timestamp + service_shared_secret;
				let computedHash = Crypto.createHash('sha256').update(hashString).digest('hex').toLowerCase();

				if (vendorHash === computedHash) {
					req.user_id = req.headers['on-behalf-of-user'];
					req.app_id = req.headers['x-api-key'];
					next();
				} else {
					let authMessage = '\n api_path is: ' + api_path
						+ '\n service_api_key is: ' + service_api_key
						+ '\n timestamp is: ' + timestamp
						+ '\n service_shared_secret is: ' + service_shared_secret
						+ '\n -- computedHash is: ' + computedHash
						+ '\n -- vendorHash is: ' + vendorHash + '\n\n';
					res.status(httpStatus.UNAUTHORIZED).send({
						"message": 'Authentication failure: computed hash did not match'
					});
				}
			} else {
				res.status(httpStatus.UNAUTHORIZED).send({
					"message": 'User validation signature does not match any vendor'
				});
			}
		}
	});
	}

};
