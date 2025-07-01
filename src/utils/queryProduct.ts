// queryProduct.ts

interface ProductFilters {
  categories?: string[];
  priceRanges?: string[];
  ratings?: string[];
  tags?: string[];
  type?: string; // Añadir filtro por type específico
}

// Query base siguiendo el patrón de tu amigo
const baseProductQuery = (userId: string, typeFilter?: string, limit?: number) => {
  const pipeline: any[] = [
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
        "object_type.parent": "product",
        "status": "active"
      }
    }
  ];

  // Añadir filtro por type si se especifica
  if (typeFilter) {
    pipeline[2]["$match"]["type"] = typeFilter;
  }

  // Añadir limit si se especifica
  if (limit) {
    pipeline.push({ "$limit": limit });
  }

  pipeline.push(
    {
      "$addFields": {
        "strId": {
          "$toString": "$_id"
        },
        "userId": userId
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
  );

  return pipeline;
};

// Query para obtener todos los productos con información de favoritos
export const getProductsWithFavorites = (userId: string, typeFilter?: string): object[] => {
  return baseProductQuery(userId, typeFilter);
};

// Query para obtener productos por categoría específica
export const getProductsByCategory = (userId: string, categoryType: string): object[] => {
  return baseProductQuery(userId, categoryType);
};

// Query para obtener productos de un proveedor específico
export const getProductsByProvider = (userId: string, providerId: string): object[] => {
  const pipeline = baseProductQuery(userId);
  
  // Modificar el match para incluir el owner
  pipeline[2]["$match"]["owner"] = providerId;
  
  return pipeline;
};

// Query para obtener un producto específico por ID
export const getProductById = (userId: string, productId: string): object[] => {
  const pipeline: any[] = [
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
        "$expr": {
          "$eq": [{ "$toString": "$_id" }, productId]
        },
        "object_type.parent": "product"
      }
    },
    {
      "$addFields": {
        "strId": {
          "$toString": "$_id"
        },
        "userId": userId
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
              "_id": 1,
              "props": 1
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
        "props": 1, // Todos los props para vista detallada
        "object_type": 1, // Información completa de la categoría
        "owner": 1,
        "published": "$updatedAt",
        "saved_product": 1
      }
    }
  ];

  return pipeline;
};

// Query para buscar productos por texto
export const searchProductsWithFavorites = (userId: string, searchText: string, typeFilter?: string): object[] => {
  const pipeline = baseProductQuery(userId, typeFilter);
  
  // Modificar el match para incluir la búsqueda
  pipeline[2]["$match"]["$or"] = [
    { "name": { "$regex": searchText, "$options": "i" } },
    { "description": { "$regex": searchText, "$options": "i" } },
    { "tags": { "$in": [new RegExp(searchText, "i")] } }
  ];
  
  return pipeline;
};

// Query para obtener productos guardados/favoritos
export const getSavedProducts = (userId: string): object[] => {
  const pipeline: any[] = [
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
        "object_type.parent": "product",
        "status": "active"
      }
    },
    {
      "$addFields": {
        "strId": {
          "$toString": "$_id"
        },
        "userId": userId
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
      "$match": {
        "saved_product": { "$ne": [] } 
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
  ];

  return pipeline;
};

// Query para filtrar productos con favoritos y filtros específicos
export const getFilteredProductsWithFavorites = (userId: string, filters: ProductFilters): object[] => {
  const pipeline = baseProductQuery(userId, filters.type);

  // Construir condiciones adicionales para el match
  const additionalMatchConditions: any = {};

  // Filtro por tags
  if (filters.tags && filters.tags.length > 0) {
    additionalMatchConditions["tags"] = {
      "$in": filters.tags
    };
  }

  // Filtro por categorías (nombres de categoría)
  if (filters.categories && filters.categories.length > 0) {
    additionalMatchConditions["object_type.name"] = {
      "$in": filters.categories
    };
  }

  // Si hay condiciones adicionales, añadirlas al match
  if (Object.keys(additionalMatchConditions).length > 0) {
    Object.assign(pipeline[2]["$match"], additionalMatchConditions);
  }

  return pipeline;
};

// Query para buscar productos filtrados con favoritos
export const searchFilteredProductsWithFavorites = (
  userId: string, 
  searchText: string, 
  filters: ProductFilters
): object[] => {
  const pipeline = baseProductQuery(userId, filters.type);

  // Construir condiciones de búsqueda y filtros
  const matchConditions: any = {
    "object_type.parent": "product",
    "status": "active"
  };

  // Añadir filtro por type si existe
  if (filters.type) {
    matchConditions["type"] = filters.type;
  }

  // Búsqueda por texto
  if (searchText.trim()) {
    matchConditions["$or"] = [
      { "name": { "$regex": searchText, "$options": "i" } },
      { "description": { "$regex": searchText, "$options": "i" } },
      { "tags": { "$in": [new RegExp(searchText, "i")] } }
    ];
  }

  // Filtro por tags específicas
  if (filters.tags && filters.tags.length > 0) {
    matchConditions["tags"] = {
      "$in": filters.tags
    };
  }

  // Filtro por categorías
  if (filters.categories && filters.categories.length > 0) {
    matchConditions["object_type.name"] = {
      "$in": filters.categories
    };
  }

  // Reemplazar el match
  pipeline[2]["$match"] = matchConditions;

  return pipeline;
};

// Query para obtener todas las tags únicas disponibles
export const getAvailableTags = (): object[] => [
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
      "object_type.parent": "product",
      "status": "active",
      "tags": { "$exists": true, "$ne": [] }
    }
  },
  {
    "$unwind": "$tags"
  },
  {
    "$group": {
      "_id": "$tags",
      "count": { "$sum": 1 }
    }
  },
  {
    "$sort": { "count": -1 }
  },
  {
    "$project": {
      "_id": 0,
      "tag": "$_id",
      "count": 1
    }
  }
];

// Exportar la interfaz actualizada
export { ProductFilters };
