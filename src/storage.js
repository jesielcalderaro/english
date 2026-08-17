// Recria a mesma API de window.storage usada dentro do Claude,
// mas usando localStorage do navegador. Assim o componente EnglishRoad.jsx
// não precisa de nenhuma alteração.

const PREFIX = "english-road:";

function fullKey(key, shared) {
  return PREFIX + (shared ? "shared:" : "user:") + key;
}

async function get(key, shared = false) {
  const raw = window.localStorage.getItem(fullKey(key, shared));
  if (raw === null) {
    throw new Error(`Key not found: ${key}`);
  }
  return { key, value: raw, shared: !!shared };
}

async function set(key, value, shared = false) {
  window.localStorage.setItem(fullKey(key, shared), value);
  return { key, value, shared: !!shared };
}

async function del(key, shared = false) {
  window.localStorage.removeItem(fullKey(key, shared));
  return { key, deleted: true, shared: !!shared };
}

async function list(prefix = "", shared = false) {
  const scope = PREFIX + (shared ? "shared:" : "user:");
  const keys = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(scope + prefix)) {
      keys.push(k.slice(scope.length));
    }
  }
  return { keys, prefix, shared: !!shared };
}

window.storage = { get, set, delete: del, list };
