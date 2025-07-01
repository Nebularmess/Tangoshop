// Query para obtener un usuario específico por ID
export const getUserById = (userId: string): object[] => [
    {
        "$match": {
            "$expr": {
                "$eq": [{ "$toString": "$_id" }, userId]
            }
        }
    },
    {
        "$project": {
            "createdAt": 0,
            "updatedAt": 0,
            "__v": 0,
            "status": 0
        }
    }
];

// Query para buscar usuario por email (útil para login/verificación)
export const getUserByEmail = (email: string): object[] => [
    {
        "$match": {
            "email": email.toLowerCase(),
            "type": "user"
        }
    },
    {
        "$project": {
            "createdAt": 0,
            "updatedAt": 0,
            "__v": 0,
            "status": 0
        }
    }
];

// Query para actualizar datos del usuario
// Nota: Esta función prepara los datos, pero la actualización se hace con updateUser endpoint
export const prepareUserUpdateData = (userId: string, updateData: any): object => {
    // Limpiar datos undefined o null
    const cleanData = Object.keys(updateData).reduce((acc, key) => {
        if (updateData[key] !== undefined && updateData[key] !== null) {
            acc[key] = updateData[key];
        }
        return acc;
    }, {} as any);

    return {
        _id: userId,
        ...cleanData,
        updatedAt: new Date().toISOString()
    };
};

// Query para verificar si existe un usuario con cierto email (para evitar duplicados)
export const checkEmailExists = (email: string, excludeUserId?: string): object[] => {
    const query: any = {
        "$match": {
            "email": email.toLowerCase(),
            "type": "user"
        }
    };

    // Si se proporciona un ID para excluir (útil en actualizaciones)
    if (excludeUserId) {
        query.$match["_id"] = { "$ne": excludeUserId };
    }

    return [
        query,
        {
            "$project": {
                "_id": 1,
                "email": 1
            }
        },
        {
            "$limit": 1
        }
    ];
};