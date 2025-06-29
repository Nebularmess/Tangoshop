export const getProviders: object[] = [
  {
    "$match": {
      "type": "commerce"
    }
  },
  {
    "$project": {
      "name": 1,
      "image": 1,
      "description": 1, // Nuevo campo
      "tags": 1,
      "props.legal_name": 1,
      "props.industry": 1,
      "props.tax_address": 1,
      "props.phone_number": 1, // Nuevo campo
      "props.email": 1 // Nuevo campo
    }
  }
];

export const getProviderById = (providerId: string): object[] => [
  {
    "$match": {
      "$expr": {
        "$eq": [{ "$toString": "$_id" }, providerId]
      },
      "type": "commerce"
    }
  },
  {
    "$project": {
      "name": 1,
      "image": 1,
      "description": 1, // Nuevo campo
      "tags": 1,
      "props.legal_name": 1,
      "props.industry": 1,
      "props.tax_address": 1,
      "props.phone_number": 1, // Nuevo campo
      "props.email": 1 // Nuevo campo
    }
  }
];

