/**
 * Created by kaile on 4/17/17.
 */


module.exports = {

	getter: function(fieldName) {
		var getterFunc = function() {
			return null;
		};
		if (typeof fieldName === 'string') {
			getterFunc = function() {
				const jsonStr = this.getDataValue(fieldName);
				if (typeof jsonStr === 'object' || typeof jsonStr === 'undefined') {
					return jsonStr;
				}
				try {
					const resultObj = JSON.parse(jsonStr);
					return resultObj;
				} catch (err) {
					console.log('xx failed to parse JSON for field', fieldName, 'from string', jsonStr);
					return null;
				}
			};
		}
		return getterFunc;
	},

	setter: function(fieldName) {
		var setterFunc = function(val) {};
		if (typeof fieldName === 'string') {
			setterFunc = function(val) {
				try {
					const resultStr = JSON.stringify(val);
					this.setDataValue(fieldName, resultStr);
				} catch (err) {
					console.log('xx failed to stringify JSON for field', fieldName, 'from object', val);
				}
			};
		}
		return setterFunc;
	}

}
