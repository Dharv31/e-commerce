import { Gutter } from '@payloadcms/ui';
import { inclusions, noHeaderFooterUrls } from 'public/constants';
import React from 'react';

const FooterComponent: React.FC = () => {
  
  return (
    <footer  className='p-20 '>
      <div>
        <Gutter>
        
          <ul className="grid grid-cols-2 gap-8">
            {inclusions.map((item, index) => (
              <li key={index} className="flex items-center space-x-4">
                <img src={item.icon} alt={item.title} className="w-6 h-6" />
                <div>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Gutter>
      </div>
    </footer>
  );
};

export default FooterComponent;
