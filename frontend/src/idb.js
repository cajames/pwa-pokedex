import idbKeyval from 'idb-keyval'

export const dbSet = async (key, value) => {
    try {
        await idbKeyval.set(key, JSON.stringify(value))
    } catch (e) {
        throw `Could not set [${key}, ${value}] from idb.`
    }
}

export const dbGet = async (key) => {
    try {
        const value = await idbKeyval.get(key)
        if (!value) {
            return value
        } else {
            return JSON.parse(value)
        }
    } catch (e) {
        throw `Could not get ${key} from idb.`
    }
}
