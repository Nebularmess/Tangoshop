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
      "tags": 1,
      "props.legal_name": 1,
      "props.industry": 1,
      "props.tax_address": 1
    }
  }
];