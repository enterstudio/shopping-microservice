/**
 * Created by mayujain on 5/3/17.
 */

let webhookResponseSchema = {
    "$schema": "webhookResponseSchema",
    "definitions": {},
    "id": "http://example.com/example.json",
    "items": {
        "additionalProperties": false,
        "id": "/items",
        "properties": {
            "address": {
                "id": "/items/properties/address",
                "type": "string"
            },
            "created_at": {
                "id": "/items/properties/created_at",
                "type": "string"
            },
            "fields": {
                "id": "/items/properties/fields",
                "type": "array"
            },
            "format": {
                "id": "/items/properties/format",
                "type": "string"
            },
            "id": {
                "id": "/items/properties/id",
                "type": "integer"
            },
            "metafield_namespaces": {
                "id": "/items/properties/metafield_namespaces",
                "items": {},
                "type": "array"
            },
            "topic": {
                "id": "/items/properties/topic",
                "type": "string"
            },
            "updated_at": {
                "id": "/items/properties/updated_at",
                "type": "string"
            }
        },
        "required": [
            "metafield_namespaces",
            "format",
            "fields",
            "created_at",
            "updated_at",
            "topic",
            "address",
            "id"
        ],
        "type": "object"
    },
    "type": "array"
};

let storesSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "definitions": {},
    "id": "http://example.com/example.json",
    "properties": {
        "_categories": {
            "id": "/properties/_categories",
            "items": {
                "id": "/properties/_categories/items",
                "properties": {
                    "_base_index": {
                        "id": "/properties/_categories/items/properties/_base_index",
                        "type": "integer"
                    },
                    "createdAt": {
                        "id": "/properties/_categories/items/properties/createdAt",
                        "type": "string"
                    },
                    "description": {
                        "id": "/properties/_categories/items/properties/description",
                        "type": "null"
                    },
                    "id": {
                        "id": "/properties/_categories/items/properties/id",
                        "type": "integer"
                    },
                    "image_url": {
                        "id": "/properties/_categories/items/properties/image_url",
                        "type": "null"
                    },
                    "name": {
                        "id": "/properties/_categories/items/properties/name",
                        "type": "string"
                    },
                    "parent": {
                        "id": "/properties/_categories/items/properties/parent",
                        "type": "null"
                    },
                    "updatedAt": {
                        "id": "/properties/_categories/items/properties/updatedAt",
                        "type": "string"
                    }
                },
                "type": "object"
            },
            "type": "array"
        },
        "_products": {
            "id": "/properties/_products",
            "items": {
                "id": "/properties/_products/items",
                "properties": {
                    "_base_index": {
                        "id": "/properties/_products/items/properties/_base_index",
                        "type": "integer"
                    },
                    "createdAt": {
                        "id": "/properties/_products/items/properties/createdAt",
                        "type": "string"
                    },
                    "description": {
                        "id": "/properties/_products/items/properties/description",
                        "type": "string"
                    },
                    "handle": {
                        "id": "/properties/_products/items/properties/handle",
                        "type": "string"
                    },
                    "id": {
                        "id": "/properties/_products/items/properties/id",
                        "type": "integer"
                    },
                    "images": {
                        "id": "/properties/_products/items/properties/images",
                        "items": {},
                        "type": "array"
                    },
                    "options": {
                        "id": "/properties/_products/items/properties/options",
                        "items": {
                            "id": "/properties/_products/items/properties/options/items",
                            "properties": {
                                "id": {
                                    "id": "/properties/_products/items/properties/options/items/properties/id",
                                    "type": "integer"
                                },
                                "name": {
                                    "id": "/properties/_products/items/properties/options/items/properties/name",
                                    "type": "string"
                                },
                                "position": {
                                    "id": "/properties/_products/items/properties/options/items/properties/position",
                                    "type": "integer"
                                },
                                "product_id": {
                                    "id": "/properties/_products/items/properties/options/items/properties/product_id",
                                    "type": "integer"
                                },
                                "values": {
                                    "id": "/properties/_products/items/properties/options/items/properties/values",
                                    "items": {
                                        "id": "/properties/_products/items/properties/options/items/properties/values/items",
                                        "type": "string"
                                    },
                                    "type": "array"
                                }
                            },
                            "type": "object"
                        },
                        "type": "array"
                    },
                    "title": {
                        "id": "/properties/_products/items/properties/title",
                        "type": "string"
                    },
                    "updatedAt": {
                        "id": "/properties/_products/items/properties/updatedAt",
                        "type": "string"
                    },
                    "variants": {
                        "id": "/properties/_products/items/properties/variants",
                        "items": {
                            "id": "/properties/_products/items/properties/variants/items",
                            "properties": {
                                "barcode": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/barcode",
                                    "type": "string"
                                },
                                "compare_at_price": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/compare_at_price",
                                    "type": "null"
                                },
                                "created_at": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/created_at",
                                    "type": "string"
                                },
                                "fulfillment_service": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/fulfillment_service",
                                    "type": "string"
                                },
                                "grams": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/grams",
                                    "type": "integer"
                                },
                                "id": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/id",
                                    "type": "integer"
                                },
                                "image_id": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/image_id",
                                    "type": "null"
                                },
                                "inventory_management": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/inventory_management",
                                    "type": "string"
                                },
                                "inventory_policy": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/inventory_policy",
                                    "type": "string"
                                },
                                "inventory_quantity": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/inventory_quantity",
                                    "type": "integer"
                                },
                                "old_inventory_quantity": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/old_inventory_quantity",
                                    "type": "integer"
                                },
                                "option1": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/option1",
                                    "type": "string"
                                },
                                "option2": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/option2",
                                    "type": "null"
                                },
                                "option3": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/option3",
                                    "type": "null"
                                },
                                "position": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/position",
                                    "type": "integer"
                                },
                                "price": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/price",
                                    "type": "string"
                                },
                                "product_id": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/product_id",
                                    "type": "integer"
                                },
                                "requires_shipping": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/requires_shipping",
                                    "type": "boolean"
                                },
                                "sku": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/sku",
                                    "type": "string"
                                },
                                "taxable": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/taxable",
                                    "type": "boolean"
                                },
                                "title": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/title",
                                    "type": "string"
                                },
                                "updated_at": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/updated_at",
                                    "type": "string"
                                },
                                "weight": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/weight",
                                    "type": "integer"
                                },
                                "weight_unit": {
                                    "id": "/properties/_products/items/properties/variants/items/properties/weight_unit",
                                    "type": "string"
                                }
                            },
                            "type": "object"
                        },
                        "type": "array"
                    },
                    "vendor": {
                        "id": "/properties/_products/items/properties/vendor",
                        "type": "string"
                    }
                },
                "type": "object"
            },
            "type": "array"
        },
        "count": {
            "id": "/properties/count",
            "type": "integer"
        },
        "rows": {
            "id": "/properties/rows",
            "items": {
                "id": "/properties/rows/items",
                "properties": {
                    "alias": {
                        "id": "/properties/rows/items/properties/alias",
                        "type": "string"
                    },
                    "createdAt": {
                        "id": "/properties/rows/items/properties/createdAt",
                        "type": "string"
                    },
                    "description": {
                        "id": "/properties/rows/items/properties/description",
                        "type": "string"
                    },
                    "handle": {
                        "id": "/properties/rows/items/properties/handle",
                        "type": "string"
                    },
                    "id": {
                        "id": "/properties/rows/items/properties/id",
                        "type": "integer"
                    },
                    "image_url": {
                        "id": "/properties/rows/items/properties/image_url",
                        "type": "null"
                    },
                    "name": {
                        "id": "/properties/rows/items/properties/name",
                        "type": "string"
                    },
                    "updatedAt": {
                        "id": "/properties/rows/items/properties/updatedAt",
                        "type": "string"
                    }
                },
                "type": "object"
            },
            "type": "array"
        }
    },
    "type": "object"
};

let schema =

module.exports = {
    webhookResponseSchema,
    storesSchema
}