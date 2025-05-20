import { CollectionConfig } from "payload";

export const Product : CollectionConfig ={
    slug:'products',
    
    admin:{
        useAsTitle: 'name',
    },
    fields:[
        {
            name:'name',
            label:'Product Name',
            type:'text',
            required:true,
        },
        {
            name:'description',
            label:'Description',
            type:'textarea',
           
        },
        {
            name:'price',
            label:'Price',
            type:'number',
            required:true,
        },
        {
            name:'stock',
            label:'Stock',
            type:'number',
            required:true,
        },
        {
            name:'category',
            label:'Category',
            type:'select',
            options: ['Phones','Laptops','Tv','Accessories','Ipads','Watches'],
        },
        {
            name: 'media',
            label: 'Media',
            type: 'relationship',
            relationTo: 'media',

        }
    ]
}