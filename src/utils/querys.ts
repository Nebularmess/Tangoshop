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