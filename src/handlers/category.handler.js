/**
 * Created by mayujain on 4/8/17.
 */

import {Categories} from '../models/models.index';
import {sequelize} from '../db/connection';
import _ from 'underscore';
const associationsHandler = require('./association.handler');

function saveCategory(name) {

    return new Promise((resolve, reject) => {

        Categories
            .findOrCreate({
                where: {
                    name: name
                }
            })
            .spread((category, created) => {
                // console.log({category: category.toJSON()});
                if (created)
                    console.log(`Saved Category '${category.name}' info in CATEGORIES table. `);
                else
                    console.log(`Category '${category.name}' already exists in CATEGORIES table. `);
                resolve(category.toJSON());
            })
            .catch((err) => {
                console.log(`ERROR creating Category : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject(err);
            });
    });
}

function saveSubCategory(tag, category) {

    return new Promise((resolve, reject) => {

        let str = "INSERT INTO `shopping`.`category` (`name`, `parentCategoryId`) VALUES ('cups', '5');";
        Categories
            .findOrCreate({
                where: {
                    name: tag,
                    parentCategoryId: category.id
                }
            })
            .spread((sub_category, created) => {

                // console.log({sub_category: sub_category.toJSON()});
                if (created)
                    console.log(`Saved Sub-Category '${sub_category.name}' info in CATEGORIES table. `);
                else
                    console.log(`Sub-Category '${sub_category.name}' already exists in CATEGORIES table. `);

                resolve(sub_category.toJSON(), created);
            })
            .catch((err) => {
                console.log(`ERROR creating Sub-Category : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject(err);
            });
    });
}

function updateCategory(name) {

    return new Promise((resolve, reject) => {

        Categories
            .findOrCreate({
                where: {
                    name: name
                }
            })
            .spread((category, created) => {
                // console.log({category: category.toJSON()});
                if (created)
                    console.log(`Saved Category '${category.name}' info in CATEGORIES table. `);
                else
                    console.log(`Category '${category.name}' already exists in CATEGORIES table. `);
                resolve(category.toJSON());
            })
            .catch((err) => {
                console.log(`ERROR creating Category : ${err.message} ${JSON.stringify(err.errors)}`);
                reject(err);
            });
    });
}

function saveTagAsSubCategory(category, product) {

    return new Promise((resolve, reject) => {

        //save sub categories if any tags are present
        if (category && product.tags) {
            let tags = product.tags.split(",");
            return saveSubCategory(tags[0], category)
                .then((sub_category, created) => {
                        resolve(sub_category);
                })
                .catch((err) => {
                    console.error(`${err}`);
                    reject(err);
                })
        } else {
            console.log("No tags present to save.");
            reject("No tags present to save.");
        }

    });

}

function getSubCategoriesForCategory(category_name) {
    return new Promise((resolve, reject) => {

        let queryStr = "select  c.* from category c, category p where c.parentCategoryId = p.id and lower(trim(p.name)) = trim(lower(?)) and c.parentCategoryId is not null";
        sequelize.query(queryStr, {
            replacements: [category_name],
            type: sequelize.QueryTypes.SELECT,
            model: Categories
        })
            .then((sub_categories) => {
                let subcat_names = [];
                sub_categories.forEach((sub_category) => {
                    subcat_names.push((sub_category.get()).name);
                });
                resolve(subcat_names);
            })
            .catch((err) => {
                console.log(`ERROR getting sub-categories : ${err.message} ${JSON.stringify(err.errors)}`);
                reject(err);
            });
    });
}

function getCategoryByName(category_name) {
    return new Promise((resolve, reject) => {

        Categories
            .findOne({
                where: {
                    name: category_name
                }
            })
            .then((category) => {
                resolve(category.toJSON());
            })
            .catch((err) => {
                console.log(`ERROR : ${err.message} ${JSON.stringify(err.errors)}`);
                reject(err);
            });
    });
}

module.exports = {
    saveCategory,
    saveSubCategory,
    updateCategory,
    saveTagAsSubCategory,
    getSubCategoriesForCategory,
    getCategoryByName
};