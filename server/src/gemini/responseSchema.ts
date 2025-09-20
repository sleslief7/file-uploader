import { Type } from '@google/genai';

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  propertyOrdering: ['displayMessage', 'text'],
  properties: {
    text: {
      type: Type.STRING,
      description: 'The normal text you would output without any filter',
    },
    displayMessage: {
      type: Type.STRING,
      nullable: false,
      description:
        'This one is same as text proeprty but this one cannot contain any technical information like IDs. This will be a customer facing message',
    },
  },
};

export default RESPONSE_SCHEMA;
