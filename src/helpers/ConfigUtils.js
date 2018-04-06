/**
 * Created by akakade on 10/26/17.
 */

'use strict';

const path = require('path');
const _ = require('underscore');

let instance = null;

class ConfigUtils {

    constructor(config) {
        this.configParams = [];
        this.paramNames = config.PARAM_NAMES;

        if (!instance) {
            instance = this;
        }
        return instance;
    }

    async loadContent() {

        if (this.configParams && this.configParams.length > 0) {
            return;
        }

        const self = this;
        return new Promise((resolve, reject) => {
                this.loadContentFromLocal();
                resolve();
        });

    }

    loadContentFromLocal() {
        console.log("Fetching Params from Local");
        for (let key in process.env) {
            if (this.paramNames.includes(key)) {
                let singleParam = {};
                singleParam.name = key.toLocaleLowerCase();
                singleParam.value = process.env[key];
                this.configParams.push(singleParam);
            }
        }
    }


    getParameter(key) {
        let result = _.find(this.configParams, function (entry) {
            return entry.name == key.toLocaleLowerCase();
        });
        return result == undefined ? "PARAM_NOT_FOUND" : result.value;

    }

}

module.exports = ConfigUtils;