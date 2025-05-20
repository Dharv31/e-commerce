import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
      {
      name:'name',
      label:'Name',
      type:'text',
    },{
      name:'phone',
      label:'Phone',
      type:'text',
    },{
      name:'role',
      label:'Role',
      type:'select',
      options: ['customer', 'admin'],
      defaultValue: 'customer',
    },{
      name:'address',
      label:'Address',
      type:'text'
    }
  ],
  timestamps: true,
}
