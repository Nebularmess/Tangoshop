export const getCategories: object[] = [
    {
        "$match": {
            "parent": "product"
        }
    },
    {
        "$project": {
            "name": true,
            "description": true,
            "image": true
        }
    }
]

export const getProviders: object[] = [
    {
        "$match": {
            "type": "commerce"
        }
    },
    {
        "$project": {
            "name": 1,
            "description": 1,
            "image": 1,
            "tags": 1,
            "props": 1
        }
    },
    {
        "$limit": 10
    }
]

export const getProducts = (_id: string) => {
    return [
        {
            "$lookup": {
                "from": "objecttypes",
                "localField": "type",
                "foreignField": "_id",
                "as": "object_type"
            }
        },
        {
            "$unwind": "$object_type"
        },
        {
            "$match": {
                "object_type.parent": "product"
            }
        },
        {
            "$limit": 5
        },
        {
            "$addFields": {
                "strId": {
                    "$toString": "$_id"
                },
                "userId": _id
            }
        },
        {
            "$lookup": {
                "from": "relations",
                "let": {
                    "userId": "$userId"
                },
                "localField": "strId",
                "foreignField": "to",
                "pipeline": [
                    {
                        "$match": {
                            "$expr": {
                                "$eq": [
                                    "$from",
                                    "$$userId"
                                ]
                            }
                        }
                    },
                    {
                        "$project": {
                            "_id": 1
                        }
                    }
                ],
                "as": "saved_product"
            }
        },
        {
            "$project": {
                "name": 1,
                "description": 1,
                "type": 1,
                "categorie": "$object_type.name",
                "tags": 1,
                "props": {
                    "price": 1,
                    "images": 1
                },
                "published": "$updatedAt",
                "saved_product": 1
            }
        }
    ]
}