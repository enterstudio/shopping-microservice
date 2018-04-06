/**
 * Created by kaile on 4/07/17.
 */

const httpStatus = require('http-status');
import { sequelize } from '../db/connection';
import models from '../models/models.index';
import Edm from '../helpers/OdataEdmHelper';
const util = require('util');
import Constants from '../helpers/Const';


function executeOdataQuery(appUserComb, odataQueryObj, model, extraFilter) {
	// console.log('\n----- The odataQueryObj is -------\n', odataQueryObj, '\n');

	if (model === models.Cartitems) { // cartitem has to be filtered by app_id and user_id
		extraFilter = "`app_id` = '"+appUserComb.app_id+"' AND `user_id` = '"+appUserComb.user_id+"' AND "+(extraFilter || '1=1');
    }
	var queryStatement = generateQueryStatement(odataQueryObj, model, extraFilter);
	var sqlQueries = [sequelize.query(queryStatement, {
        replacements: odataQueryObj.parameters,
        type: sequelize.QueryTypes.SELECT,
        model: model
    })];
	var expandSequence = [];

	const expandExtraFilter = odataQueryObj.where + ' AND ' + (extraFilter || '1=1');
	odataQueryObj.includes.forEach(function(includeObj) {
		// console.log('\n--- The includeObj is ---\n', includeObj, '\n');

		var navOptions = null;
       	try {
       		navOptions = retrieveNavOptions(model, includeObj.navigationProperty);
       	} catch (err) {
       		throw err;
       	}

   		var sequelizeRequest = createExpandQuery(includeObj, 
   												navOptions, 
   												{
   													baseFilter: expandExtraFilter,
   													baseParams: odataQueryObj.parameters
   												});
   		expandSequence.push(navOptions);
   		sqlQueries.push(sequelizeRequest);

		// console.log('--- nested expands from '+includeObj.navigationProperty+' are ---\n', includeObj.includes);
	});

	return sequelize.Promise.all(sqlQueries).then(function(results) {
		// console.log('\n******** THE results ARE: ********\n', results);
		if (results.length == 1) { // no expanding
			return {
				count: results[0].length,
				rows: results[0]
			};
		} else { // has expanding
			var returnData = {
				count: results[0].length,
				rows: results[0]
			};
			for (var i = 1; i < results.length; i ++) {
				let baseIndexName = expandSequence[i-1].baseIndexName;
				for (var j = 0; j < returnData.rows.length; j ++) {
					let baseIndex = returnData.rows[j].dataValues["_id"];
					var selectedRes = results[i].filter(function(expandEntity) {
						return expandEntity.dataValues[baseIndexName] === baseIndex;
					});
					returnData.rows[j].dataValues[expandSequence[i-1].navigationName] = selectedRes;
				}
			}
            return returnData;
		}
    }).catch(function(error) {
    	error._statusCode = error._statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    	throw error;
    });
}

/**
 * Create Sequelize query based on $expand clause.
 */
function createExpandQuery(includeObj, navOptions, baseFilterBlock) {
    var queryExpandStatement = generateJoinQueryStatement(includeObj, navOptions, baseFilterBlock.baseFilter);
    // console.log('----- queryExpandStatement is\n', queryExpandStatement);

    var replacementParams = baseFilterBlock.baseParams.concat(includeObj.parameters);
    
    return sequelize.query(queryExpandStatement, {
        replacements: replacementParams,
        type: sequelize.QueryTypes.SELECT,
        model: navOptions.targetModel
    });
}

/**
 * Get navigation configuration from EdmHelper.
 */
function retrieveNavOptions(baseModel, navigationProperty) {
	var navOptionSet = Edm.EdmNavigation[baseModel.name];
    if (navOptionSet == null) {
    	throw {
			_statusCode: httpStatus.BAD_REQUEST,
    		message: 'Entity `' + baseModel.name + '` does NOT have expandable property'
    	};
    }
    var navOptions = navOptionSet[navigationProperty];
    if (navOptions == null) {
    	throw {
			_statusCode: httpStatus.BAD_REQUEST,
    		message: 'Invalid expand property `' + navigationProperty + '` for entity ' + baseModel.name
    	};
    }

    return navOptions;
}

/**
 * Generate SQL statement to SELECT one table.
 */
function generateQueryStatement(odataQueryObj, model, extraFilter = null) {
	var selectClause = columnNameInterpreter(odataQueryObj.select, model.name);
	var extraFilter = columnNameInterpreter(extraFilter, model.name);
	var queryStatement = 'SELECT id as `_id`, ' + selectClause
    + ' FROM ' + model.name + ' where ' + odataQueryObj.where
    + ' AND ' + (extraFilter || '1=1')
    + ' ORDER BY ' + odataQueryObj.orderby;

    if (odataQueryObj.limit) {
        queryStatement += ' LIMIT ' + (odataQueryObj.skip || 0) + ', ' + odataQueryObj.limit;
    } else if (odataQueryObj.skip) {
        queryStatement += ' LIMIT ' + odataQueryObj.skip + ', ' + odataQueryObj.skip+Constants.MaxRowNumAllowedToFetch;
    }

    return queryStatement;
}

/**
 * Generate SQL statement to JOIN multiple tables
 * to navigate from one resource type to another.
 */
function generateJoinQueryStatement(expandObj, options, baseFilter) {
	var expandSelectStr = columnNameInterpreter(expandObj.select, options.targetTableName);
	var expandWhereStr = columnNameInterpreter(expandObj.where, options.targetTableName);
	var baseFilterStr = columnNameInterpreter(baseFilter, options.baseTableName);

	var queryExpandStatement = 'SELECT DISTINCT ' + options.pointerFields
		+ ', ' + expandSelectStr
        + ' FROM ' + options.targetModel.name + ' ' + options.targetTableName 
        + ' ' + options.joinType + ' ' + options.joinWith
        + ' ON ' + options.association
        + ' AND ' + (baseFilterStr || '1=1')
        + ' WHERE ' + expandWhereStr + ' AND ' + (options.extraFilter  || '1=1')
        + ' ORDER BY ' + expandObj.orderby;

    if (expandObj.limit) {
        queryExpandStatement += ' LIMIT ' + (expandObj.skip || 0) + ', ' + expandObj.limit;
    } else if (expandObj.skip) {
        queryExpandStatement += ' LIMIT ' + expandObj.skip + ', ' + expandObj.skip+Constants.MaxRowNumAllowedToFetch;
    }

    return queryExpandStatement;
}

/**
 * Insert table name into each of the column names
 * to avoid ambiguity of SQL statement.
 */
function columnNameInterpreter(clause, tableName) {
	if (clause === null) {
		return null;
	}
	var clauseStr = clause;
	if (clause === '*') {
		clauseStr = tableName + '.*';
	} else {
		var i = 0;
		var counter = 0;
		while (i < clauseStr.length) {
			if (clauseStr[i] === '`') {
				counter ++;
				if (counter%2 == 1) {
					clauseStr = clauseStr.slice(0, i) + tableName + '.' + clauseStr.slice(i);
					i += (tableName.length+1);
				}
			}
			i ++;
		}
	}
	return clauseStr;
}


module.exports = {
	executeOdataQuery, 
	generateQueryStatement, 
	columnNameInterpreter, 
	generateJoinQueryStatement
};
