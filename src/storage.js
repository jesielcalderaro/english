import { createClient } from "@supabase/supabase-js";

// Essas duas informações são seguras para ficar expostas no código do navegador:
// a chave "publishable" só funciona dentro das regras que configuramos no banco
// (cada PIN só enxerga os próprios dados).
const SUPABASE_URL = "https://xkeeyvckelcleuiifrxi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_yMNDlP12jFpqXWX945MZIA_ppxVQzEp";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const PREFIX = "english-road:";
const PIN_KEY = "english-road:pin";

function fullKey(key, shared) {
  return PREFIX + (shared ? "shared:" : "user:") + key;
}

// Identifica o "dono" dos dados no banco. Guardado no localStorage do
// aparelho para não pedir de novo depois da primeira vez.
function getPin() {
  let pin = window.localStorage.getItem(PIN_KEY);
  if (!pin) {
    const input = window.prompt(
      "Crie um código pessoal (4 a 8 dígitos) para sincronizar seu progresso entre aparelhos.\n\n" +
      "Se já criou um código em outro aparelho, digite o mesmo aqui."
    );
    pin = (input || "").trim() || "sem-pin";
    window.localStorage.setItem(PIN_KEY, pin);
  }
  return pin;
}

async function get(key, shared = false) {
  const pin = getPin();
  try {
    const { data, error } = await supabase
      .from("app_storage")
      .select("value")
      .eq("pin", pin)
      .eq("key", key)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      window.localStorage.setItem(fullKey(key, shared), data.value); // atualiza o cache local
      return { key, value: data.value, shared: !!shared };
    }
  } catch (e) {
    console.warn("Supabase indisponível, usando cache local:", e.message);
  }

  // Sem dado na nuvem (ou offline) — tenta o cache local
  const local = window.localStorage.getItem(fullKey(key, shared));
  if (local !== null) return { key, value: local, shared: !!shared };

  throw new Error(`Key not found: ${key}`);
}

async function set(key, value, shared = false) {
  // Grava local primeiro — resposta instantânea na interface
  window.localStorage.setItem(fullKey(key, shared), value);

  const pin = getPin();
  try {
    const { error } = await supabase
      .from("app_storage")
      .upsert({ pin, key, value, updated_at: new Date().toISOString() }, { onConflict: "pin,key" });
    if (error) throw error;
  } catch (e) {
    console.warn("Não foi possível sincronizar com a nuvem agora (salvo localmente):", e.message);
  }

  return { key, value, shared: !!shared };
}

async function del(key, shared = false) {
  window.localStorage.removeItem(fullKey(key, shared));
  const pin = getPin();
  try {
    await supabase.from("app_storage").delete().eq("pin", pin).eq("key", key);
  } catch (e) {
    console.warn("Não foi possível remover na nuvem:", e.message);
  }
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
