import { CollectionConfig } from 'payload'

export const Order: CollectionConfig = {
  slug: 'orders',
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
        name:'items',
        label:'Items',
        type:'array',
        fields:[
            {
                name:'product',
                label:'Product',
                type:'relationship',
                relationTo: 'products',
                required:true,
            },{
                name:'quantity',
                label:'Quantity',
                type:'number',
                required:true,
            }, {
                name:'price',
                label:'Price',
                type:'number',
                required:true,
            }]
    },{
        name:'status',
        label:'Status',
        type:'select',
        options: ['pending','shipped','delivered','cancelled'],
        defaultValue: 'pending',
    },{
        name:'total',
        label:'Total',
        type:'number',
        required:true,
    },{
        name:'shippingaddress',
        label:'ShippingAddress',
        type:'text',
        required:true,
    },
  ],
}
