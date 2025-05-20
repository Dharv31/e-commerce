import { CollectionConfig } from "payload";

export const Cart: CollectionConfig = {
    slug: 'cart',
    admin: {
        useAsTitle: 'user',
    },
    fields: [
        {
            name: 'user',
            label: 'User',
            type: 'relationship',
            relationTo: 'users',
            required: true,
        },
        {
            name: 'products',
            label: 'Products',
            type: 'array',
            minRows: 1,
            maxRows: 10,
            fields: [
                {
                    name: 'product',
                    label: 'Product',
                    type: 'relationship',
                    relationTo: 'products',
                    required: true,
                },
                {
                    name: 'quantity',
                    label: 'Quantity',
                    type: 'number',
                    required: true,
                },
            ],
        },
    ],
}