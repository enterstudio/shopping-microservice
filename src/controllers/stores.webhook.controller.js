/**
 * Created by mayujain on 6/23/17.
 */

const httpStatus = require('http-status');
const storesHandler = require('../handlers/store.handler');
const associationsHandler = require('../handlers/association.handler');

module.exports = {

    //Update store
    updateStoreFromWebhook: (req, res, next) => {
        updateStoreInfo(req.body);
        res.status(httpStatus.OK).send("OK");
    },

    //delete product and join association
    deleteStoreFromWebhook: (req, res, next) => {
        deleteStore(req.body);
        res.status(httpStatus.OK).send("OK");
    }
};


const updateStoreInfo = async(store) => {
    try {
        await storesHandler.updateExistingStore(store); //update store info
        console.log(`Updated store info.`)
    }
    catch (err) {
        console.error(`Store not found to update.`);
    }
};

const deleteStore = async(store) => {
    try {
        const success = await associationsHandler.deleteStore(store.id); //delete association rows for that store
        if(success) await storesHandler.deleteStore(store.id); //delete store info
    } catch (err) {
        console.error(`Store not found to delete.`);
    }
};