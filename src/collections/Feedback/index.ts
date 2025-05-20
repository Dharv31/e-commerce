import { CollectionConfig } from "payload";

export const Feedback: CollectionConfig = {
    slug: 'feedback',
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
            name: 'product',
            label: 'Product',   
            type: 'relationship',
            relationTo: 'products',
            required: true,
        },
        {
            name: 'rating',
            label: 'Rating',
            type: 'number',
            required: true,
            min: 1,
            max: 5,
            defaultValue: 5,
        },
        {
            name: 'comment',
            label: 'Comment',
            type: 'textarea',
            required: true,
            maxLength: 500,
            minLength: 10,
        },
        {
            name: 'createdAt',
            label: 'Created At',
            type: 'date',       
            defaultValue: () => new Date(),
            admin: {
                position: 'sidebar',
            },
        }
    ]
}