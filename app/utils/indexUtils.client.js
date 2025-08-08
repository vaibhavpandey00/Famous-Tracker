

export const hasDataChanged = (originalData, formData) => {
    if (!originalData) return true;

    const currentData = { ...formData };
    delete currentData.haveActiveSubscription;

    return !deepEqual(originalData, currentData);
};

//   Function to get changed fields (optional - for debugging/logging)
export const getChangedFields = (originalData, formData) => {
    if (!originalData) return {};

    const currentData = { ...formData };
    delete currentData.haveActiveSubscription;

    const changes = {};
    const findChanges = (original, current, path = '') => {
        for (const key in current) {
            const currentPath = path ? `${path}.${key}` : key;

            if (typeof current[ key ] === 'object' && current[ key ] !== null && !Array.isArray(current[ key ])) {
                if (typeof original[ key ] === 'object' && original[ key ] !== null) {
                    findChanges(original[ key ], current[ key ], currentPath);
                } else {
                    changes[ currentPath ] = { from: original[ key ], to: current[ key ] };
                }
            } else if (original[ key ] !== current[ key ]) {
                changes[ currentPath ] = { from: original[ key ], to: current[ key ] };
            }
        }
    };

    findChanges(originalData, currentData);
    return changes;
};


const deepEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true;

    if (obj1 == null || obj2 == null) return false;

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return obj1 === obj2;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
        if (!keys2.includes(key)) return false;
        if (!deepEqual(obj1[ key ], obj2[ key ])) return false;
    }

    return true;
};