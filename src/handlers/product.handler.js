/**
 * Created by mayujain on 4/8/17.
 */

import {Products} from '../models/models.index';

function saveProduct(product) {

    return new Promise((resolve, reject) => {

        Products
            .create({
                id: product.id,
                title: product.title,
                vendor: product.vendor,
                description: product.body_html,
                handle: product.handle,
                images: product.images,
                options: product.options,
                variants: product.variants
            })
            .then((newProduct) => {
                // console.log({newProduct: newProduct.toJSON()});
                console.log(`Saved Product '${newProduct.title}' info in PRODUCTS table.`);
                resolve(newProduct.toJSON());
            })
            .catch((err) => {
                console.log(`ERROR creating Product : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject(err);
            });
    });
}

function removeProduct(product) {

    return new Promise((resolve, reject) => {

        Products
            .destroy({
                where: {
                    id: {$eq: product.id}
                }
            })
            .then((response) => {
                console.log(`Deleted Product with id '${product.id}'`);
                resolve(response);
            })
            .catch((err) => {
                console.log(`ERROR deleting Product : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject(err);
            });

    });
}

function updateProductInfo(product) {

    return new Promise((resolve, reject) => {

        Products
            .update({
                    title: product.title,
                    vendor: product.vendor,
                    description: product.body_html,
                    handle: product.handle,
                    images: product.images,
                    options: product.options,
                    variants: product.variants
                },
                {
                    where: {
                        id: {$eq: product.id}
                    }
                })
            .then((response) => {
                if (response[0] === 1) {
                    console.log(`Updated Product info.`);
                    resolve(true);
                } else {
                    console.log("Product does not exist in DB.");
                    resolve(false);
                }


            })
            .catch((err) => {
                console.log(`ERROR updating Product : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject(err);
            });

    });
}


module.exports = {
    saveProduct,
    removeProduct,
    updateProductInfo
};
