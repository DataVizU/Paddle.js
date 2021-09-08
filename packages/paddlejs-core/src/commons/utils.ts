/**
 * @file utils
 */

/**
 * getGlobalInterface
 *
 * @returns ns
 */
export function getGlobalInterface(): any {
    let ns: any;
    if (typeof (window) !== 'undefined') {
        ns = window;
    }
    else if (typeof (global) !== 'undefined') {
        ns = global;
    }
    else if (typeof (self) !== 'undefined') {
        ns = self;
    }
    else {
        throw new Error('Could not find a global object');
    }
    return ns;
}


/**
 * getOrMakeGlobalProperty
 * @param {string} key property key
 * @param {any} value property value
 * @returns {any} global property
 */
export function getOrMakeGlobalProperty(key: string, value?: Object | String | Number | Boolean)
    : any {
    const globalInterface = getGlobalInterface();
    if (globalInterface[key]) {
        return globalInterface[key];
    }
    globalInterface[key] = value;
    return globalInterface[key];
}


/**
 * find target var by key
 * @param {Object | Array} vars model vars
 * @param {string} key var name
 * @returns {Object} var
 */
export function findVarByKey(vars, key) {
    if (Array.isArray(vars)) {
        return vars.find(item => item.name === key);
    }
    return vars[key];
}


/**
 * add var to vars
 * @param {Object | Array} vars model vars
 * @param {Object} item var
 */
export function AddItemToVars(vars, item) {
    const isVarsArray = Array.isArray(vars);
    const isItemArray = Array.isArray(item);
    if (isItemArray) {
        if (isVarsArray) {
            vars.splice(vars.length - 1, 0, ...item);
        }
        else {
            item.forEach(varItem => {
                vars[varItem.name] = varItem;
            });
        }
        return;
    }
    if (isVarsArray) {
        vars.push(item);
        return;
    }
    vars[item.name] = item;
}

/**
 * traverse vars and deal var item
 * @param {Object | Array} vars model vars
 * @param {Function} callback deal var item
 */
export function traverseVars(vars, callback) {
    const isVarsArray = Array.isArray(vars);
    if (isVarsArray) {
        vars.forEach(item => {
            callback(item);
        });
        return;
    }
    Object.keys(vars).forEach(key => {
        callback(vars[key]);
    });
}