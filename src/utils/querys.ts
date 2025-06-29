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