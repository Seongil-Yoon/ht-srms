import assert from 'assert';

//Declare our custom type enum with his custom type validators, this could be extended if you want.
const types = {
    NUMBER: (data) => typeof data === 'number' && !isNaN(data),
    STRING: (data) => typeof data === 'string',
    DATE: (data) => typeof data === 'date',
    BOOL: (data) => typeof data === 'boolean',
    OBJECT: (data) => typeof data === 'object',
};

//This function handle the variable assignation if this is succed return the value if fail throw exception.
// const matchType = (value, validator) =>
//     validator(value) ? value : assert(false, 'INVALID TYPE ASSIGNATION');

const matchType = (value, validator) => {
    if (validator(value)) {
        return value;
    } else {
        throw new Error('INVALID TYPE');
    }
};

export {types, matchType};
