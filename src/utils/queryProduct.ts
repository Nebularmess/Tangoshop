// queryProduct.ts

// Query para obtener todos los productos
export const getProducts: object[] = [
  {
    "$lookup": {
      "from": "objecttypes",
      "localField": "type",
      "foreignField": "_id",
      "as": "object_type"
    }
  },
  {
    "$match": { 
      "object_type.parent": "product",
      "status": "active" // Solo productos activos
    }
  },
  {
    "$project": {
      "name": 1,
      "description": 1,
      "image": 1, // Imagen principal (si existe)
      "type": 1, // Categoría del producto
      "props.price": 1, // Precio del producto
      "props.images": { "$slice": ["$props.images", 1] }, // Solo la primera imagen del array
      "object_type.name": 1 // Nombre de la categoría
    }
  }
];

// Query para obtener productos por categoría específica
export const getProductsByCategory = (categoryType: string): object[] => [
  {
    "$lookup": {
      "from": "objecttypes",
      "localField": "type",
      "foreignField": "_id",
      "as": "object_type"
    }
  },
  {
    "$match": { 
      "object_type.parent": "product",
      "type": categoryType,
      "status": "active"
    }
  },
  {
    "$project": {
      "name": 1,
      "description": 1,
      "image": 1,
      "type": 1,
      "props.price": 1,
      "props.images": { "$slice": ["$props.images", 1] },
      "object_type.name": 1
    }
  }
];

// Query para obtener productos de un proveedor específico
export const getProductsByProvider = (providerId: string): object[] => [
  {
    "$lookup": {
      "from": "objecttypes",
      "localField": "type",
      "foreignField": "_id",
      "as": "object_type"
    }
  },
  {
    "$match": { 
      "object_type.parent": "product",
      "owner": providerId,
      "status": "active"
    }
  },
  {
    "$project": {
      "name": 1,
      "description": 1,
      "image": 1,
      "type": 1,
      "props.price": 1,
      "props.images": { "$slice": ["$props.images", 1] },
      "object_type.name": 1
    }
  }
];

// Query para obtener un producto específico por ID
export const getProductById = (productId: string): object[] => [
  {
    "$lookup": {
      "from": "objecttypes",
      "localField": "type",
      "foreignField": "_id",
      "as": "object_type"
    }
  },
  {
    "$match": {
      "$expr": {
        "$eq": [{ "$toString": "$_id" }, productId]
      },
      "object_type.parent": "product"
    }
  },
  {
    "$project": {
      "name": 1,
      "description": 1,
      "image": 1,
      "type": 1,
      "props": 1, // Todos los props para vista detallada
      "object_type": 1, // Información completa de la categoría
      "tags": 1,
      "owner": 1
    }
  }
];

// Query para buscar productos por texto
export const searchProducts = (searchText: string): object[] => [
  {
    "$lookup": {
      "from": "objecttypes",
      "localField": "type",
      "foreignField": "_id",
      "as": "object_type"
    }
  },
  {
    "$match": { 
      "object_type.parent": "product",
      "status": "active",
      "$or": [
        { "name": { "$regex": searchText, "$options": "i" } },
        { "description": { "$regex": searchText, "$options": "i" } },
        { "tags": { "$in": [new RegExp(searchText, "i")] } }
      ]
    }
  },
  {
    "$project": {
      "name": 1,
      "description": 1,
      "image": 1,
      "type": 1,
      "props.price": 1,
      "props.images": { "$slice": ["$props.images", 1] },
      "object_type.name": 1
    }
  }
];

export const getSavedProducts = (userId: string): object[] => [
  // Primero filtrar solo productos
  {
    "$lookup": {
      "from": "objecttypes",
      "localField": "type",
      "foreignField": "_id",
      "as": "object_type"
    }
  },
  {
    "$match": { 
      "object_type.parent": "product",
      "status": "active"
    }
  },
  
  {
    "$lookup": {
      "from": "objects", 
      "let": { "productId": "$_id" },
      "pipeline": [
        {
          "$match": {
            "$expr": {
              "$and": [
                { "$eq": ["$type", "saved_product"] },
                { "$eq": ["$from", userId] }, 
                { "$eq": ["$to", "$$productId"] } 
              ]
            }
          }
        }
      ],
      "as": "saved_relation"
    }
  },
 
  {
    "$match": {
      "saved_relation": { "$ne": [] } 
    }
  },

  {
    "$project": {
      "name": 1,
      "description": 1,
      "image": 1,
      "type": 1,
      "props.price": 1,
      "props.images": { "$slice": ["$props.images", 1] },
      "object_type.name": 1,
      "saved_relation": 1 
    }
  }
];


export const searchSavedProducts = (userId: string, searchText: string): object[] => [
  
  {
    "$lookup": {
      "from": "objecttypes",
      "localField": "type",
      "foreignField": "_id",
      "as": "object_type"
    }
  },
  {
    "$match": { 
      "object_type.parent": "product",
      "status": "active",
     
      "$or": [
        { "name": { "$regex": searchText, "$options": "i" } },
        { "description": { "$regex": searchText, "$options": "i" } },
        { "tags": { "$in": [new RegExp(searchText, "i")] } }
      ]
    }
  },
  
  {
    "$lookup": {
      "from": "objects",
      "let": { "productId": "$_id" },
      "pipeline": [
        {
          "$match": {
            "$expr": {
              "$and": [
                { "$eq": ["$type", "saved_product"] },
                { "$eq": ["$from", userId] },
                { "$eq": ["$to", "$$productId"] }
              ]
            }
          }
        }
      ],
      "as": "saved_relation"
    }
  },
 
  {
    "$match": {
      "saved_relation": { "$ne": [] }
    }
  },
  {
    "$project": {
      "name": 1,
      "description": 1,
      "image": 1,
      "type": 1,
      "props.price": 1,
      "props.images": { "$slice": ["$props.images", 1] },
      "object_type.name": 1,
      "saved_relation": 1
    }
  }
];

export const getProductsWithFavorites = (userId: string): object[] => [
  {
    "$lookup": {
      "from": "objecttypes",
      "localField": "type",
      "foreignField": "_id",
      "as": "object_type"
    }
  },
  {
    "$match": { 
      "object_type.parent": "product",
      "status": "active"
    }
  },
  // JOIN con relaciones saved_product para este usuario
  {
    "$lookup": {
      "from": "objects",
      "let": { "productId": "$_id" },
      "pipeline": [
        {
          "$match": {
            "$expr": {
              "$and": [
                { "$eq": ["$type", "saved_product"] },
                { "$eq": ["$from", userId] },
                { "$eq": ["$to", "$$productId"] }
              ]
            }
          }
        }
      ],
      "as": "saved_by_user"
    }
  },
  {
    "$project": {
      "name": 1,
      "description": 1,
      "image": 1,
      "type": 1,
      "props.price": 1,
      "props.images": { "$slice": ["$props.images", 1] },
      "object_type.name": 1,
      "saved_by_user": 1 // Array vacío = no guardado, con elementos = guardado
    }
  }
];

// Query para buscar productos CON información de favoritos
export const searchProductsWithFavorites = (userId: string, searchText: string): object[] => [
  {
    "$lookup": {
      "from": "objecttypes",
      "localField": "type",
      "foreignField": "_id",
      "as": "object_type"
    }
  },
  {
    "$match": { 
      "object_type.parent": "product",
      "status": "active",
      "$or": [
        { "name": { "$regex": searchText, "$options": "i" } },
        { "description": { "$regex": searchText, "$options": "i" } },
        { "tags": { "$in": [new RegExp(searchText, "i")] } }
      ]
    }
  },
  // JOIN con relaciones saved_product
  {
    "$lookup": {
      "from": "objects",
      "let": { "productId": "$_id" },
      "pipeline": [
        {
          "$match": {
            "$expr": {
              "$and": [
                { "$eq": ["$type", "saved_product"] },
                { "$eq": ["$from", userId] },
                { "$eq": ["$to", "$$productId"] }
              ]
            }
          }
        }
      ],
      "as": "saved_by_user"
    }
  },
  {
    "$project": {
      "name": 1,
      "description": 1,
      "image": 1,
      "type": 1,
      "props.price": 1,
      "props.images": { "$slice": ["$props.images", 1] },
      "object_type.name": 1,
      "saved_by_user": 1
    }
  }
];