function Validator(){
    if (!(this instanceof Validator)) {
        return new Validator();
    }
}

Validator.prototype.customValidators = {
    customValidators: {
        isArray: function(value) {
            return Array.isArray(value);
        },
        eachIsPresent: function(values, prop) {
            return values.every(function(val) {
                return val.hasOwnProperty(prop);
            });
        },
        getByIdParamCorrect: function(value) {
            // the param value must be something with a brackets
            if (value[0] != '(' 
                || value[value.length-1] != ')' 
                || value === '()') {
                return false;
            }
            const idVal = Number(value.substring(1,value.length-1));
            // content within the brackets must be a number
            if (isNaN(idVal)) {
                return false;
            }
            // the number must be an integer
            if (idVal % 1 !== 0) {
                return false;
            }
            return true;
        }, 
        addressesAreCorrect: function(values) {
            if (values === undefined) {
                return true;
            }
            return values.every(function(val) {
                return (val.hasOwnProperty('address1')
                    || val.hasOwnProperty('address2')
                    || val.hasOwnProperty('province')
                    || val.hasOwnProperty('province_code')
                    || val.hasOwnProperty('city')
                    || val.hasOwnProperty('zip')
                    || val.hasOwnProperty('country')
                    || val.hasOwnProperty('country_code')
                    || val.hasOwnProperty('country_name'));
            });
        }
    }
};

Validator.prototype.validateCartRequest = function(req){

    req.checkBody('lineItems' ,'Missing lineItems').isArray().notEmpty();
    req.checkBody('lineItems', 'Missing productId').eachIsPresent('productId');
    req.checkBody('lineItems', 'Missing title').eachIsPresent('title');
    req.checkBody('lineItems', 'Missing variantId').eachIsPresent('variantId');
    req.checkBody('lineItems', 'Missing variantTitle').eachIsPresent('variantTitle');
    req.checkBody('lineItems', 'Missing quantity').eachIsPresent('quantity');
    req.checkBody('lineItems', 'Missing price').eachIsPresent('price');

};

Validator.prototype.validateOrderRequest = function(req){

    req.checkBody('email', 'Missing email or not a valid email').notEmpty().isEmail();
    req.checkBody('isPaid', 'Missing isPaid').notEmpty().isBoolean();
    req.checkBody('lineItems', 'Missing lineItems').isArray().notEmpty();    
    req.checkBody('lineItems', 'Missing variantId').eachIsPresent('variantId');
    req.checkBody('lineItems', 'Missing quantity').eachIsPresent('quantity');
    req.checkBody('lineItems', 'Missing price').eachIsPresent('price');

};

Validator.prototype.validateOdataGetByIdRequest = function(req) {

    req.checkParams('id', 'Invalid value of `id` in the brackets of URL').notEmpty().getByIdParamCorrect();
};

Validator.prototype.validateCustomerRequest = function(req) {

    req.checkBody('email', 'customer email address required').notEmpty();
    req.checkBody('first_name', 'customer first name required').notEmpty();
    req.checkBody('last_name', 'customer last name required').notEmpty();
    // req.checkBody('phone', 'customer phone required').notEmpty();
    req.checkBody('addresses', 'No valid property exists in addresses field').addressesAreCorrect();
};

Validator.prototype.validateShoppingCartRequest = function(req) {

    req.checkBody('store_id', 'store_id required').notEmpty();
    req.checkBody('prod_id', 'prod_id required').notEmpty();
    req.checkBody('variant_id', 'variant_id required').notEmpty();
    req.checkBody('quantity', 'quantity required').notEmpty().isInt();
};

module.exports = Validator;
// module.exports.Validator = Validator;