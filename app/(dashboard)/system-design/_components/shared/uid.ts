let _uid = 0
export function uid() { return `${Date.now()}-${++_uid}` }
