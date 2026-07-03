#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { KlaviyoClient, KlaviyoError } from './client.ts';
import { listFlows, getFlowWithDefinition, createFlow, updateFlowStatus, deleteFlow } from './flows.ts';
import type { FlowStatus } from './flows.ts';
import { listTemplates, createHtmlTemplate, deleteTemplate } from './templates.ts';
import { applyParams, sanitizeForCreate } from './provision.ts';
import type { FlowParams } from './provision.ts';

/* ------------------------------- arg parsing ------------------------------ */

type Parsed = { _: string[]; flags: Record<string, string | boolean> };

function parseArgs(argv: string[]): Parsed {
  const _: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        flags[key] = true;
      } else {
        flags[key] = next;
        i++;
      }
    } else {
      _.push(a);
    }
  }
  return { _, flags };
}

function requireFlag(flags: Parsed['flags'], name: string): string {
  const v = flags[name];
  if (typeof v !== 'string') throw new Error(`Falta el argumento --${name}`);
  return v;
}

function readJson(path: string): any {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function print(obj: unknown): void {
  console.log(JSON.stringify(obj, null, 2));
}

/* --------------------------------- help ----------------------------------- */

const HELP = `Klaviyo flow provisioner (VegLiss / Qualivo)

Uso:  node src/cli.ts <comando> [opciones]

Lectura (no modifican la cuenta):
  accounts                          Verifica la clave y muestra la cuenta
  metrics [--search <txt>]          Lista métricas/eventos disponibles
  flows:list                        Lista los flows (id, nombre, status)
  flows:export <id> [--out <file>]  Exporta la definición de un flow (base clonable)
  templates:list                    Lista las plantillas de email

Escritura (por defecto DRY-RUN; añade --commit para ejecutar):
  templates:create --name <n> --html <file> [--commit]
  flows:create   --name <n> --definition <file> [--commit]
  flows:clone    --from <id> [--name <n>] [--params <file>] [--commit]
  flows:status   <id> <draft|manual|live> [--commit]

Notas:
  - La clave privada se lee de KLAVIYO_API_KEY (klaviyo/.env o entorno). Nunca se commitea.
  - Los flows creados por API entran en 'draft'; actívalos con flows:status <id> live.
`;

/* ------------------------------- commands --------------------------------- */

async function main(): Promise<void> {
  const { _, flags } = parseArgs(process.argv.slice(2));
  const command = _[0];

  if (!command || command === 'help' || flags.help) {
    console.log(HELP);
    return;
  }

  const client = KlaviyoClient.fromEnv();
  const commit = flags.commit === true;

  switch (command) {
    case 'accounts': {
      const res = await client.request('/api/accounts/');
      const acc = res.data?.[0]?.attributes ?? {};
      print({
        organization: acc.contact_information?.organization_name,
        sender: `${acc.contact_information?.default_sender_name} <${acc.contact_information?.default_sender_email}>`,
        public_api_key: acc.public_api_key,
        timezone: acc.timezone,
        currency: acc.preferred_currency,
        test_account: acc.test_account,
      });
      break;
    }

    case 'metrics': {
      const res = await client.request('/api/metrics/');
      const search = typeof flags.search === 'string' ? flags.search.toLowerCase() : null;
      const rows = (res.data ?? [])
        .map((m: any) => ({
          id: m.id,
          name: m.attributes.name,
          integration: m.attributes.integration?.name,
        }))
        .filter((m: any) => !search || m.name.toLowerCase().includes(search));
      print(rows);
      break;
    }

    case 'flows:list': {
      const res = await listFlows(client);
      print(
        (res.data ?? []).map((f: any) => ({
          id: f.id,
          name: f.attributes.name,
          status: f.attributes.status,
        })),
      );
      break;
    }

    case 'flows:export': {
      const id = _[1];
      if (!id) throw new Error('Uso: flows:export <id> [--out <file>]');
      const res = await getFlowWithDefinition(client, id);
      const doc = {
        _source: {
          flow_id: id,
          name: res.data?.attributes?.name,
          status: res.data?.attributes?.status,
        },
        definition: res.data?.attributes?.definition,
      };
      if (typeof flags.out === 'string') {
        writeFileSync(flags.out, JSON.stringify(doc, null, 2));
        console.log(`Definición guardada en ${flags.out}`);
      } else {
        print(doc);
      }
      break;
    }

    case 'templates:list': {
      const res = await listTemplates(client);
      print(
        (res.data ?? []).map((t: any) => ({
          id: t.id,
          name: t.attributes.name,
          editor_type: t.attributes.editor_type,
        })),
      );
      break;
    }

    case 'templates:create': {
      const name = requireFlag(flags, 'name');
      const html = readFileSync(requireFlag(flags, 'html'), 'utf8');
      if (!commit) {
        print({ dryRun: true, wouldCreateTemplate: { name, htmlBytes: html.length } });
        console.log('\n(añade --commit para crearla)');
        break;
      }
      const res = await createHtmlTemplate(client, name, html);
      print({ created: res.data?.id, name: res.data?.attributes?.name });
      break;
    }

    case 'flows:create': {
      const name = requireFlag(flags, 'name');
      const doc = readJson(requireFlag(flags, 'definition'));
      const raw = doc.definition ?? doc; // acepta {definition:{...}} o la definición pelada
      const definition = sanitizeForCreate(raw); // exportación -> formato de creación
      if (!commit) {
        print({ dryRun: true, name, triggers: definition.triggers, actions: definition.actions?.length });
        console.log('\n(añade --commit para crear el flow en estado draft)');
        break;
      }
      const res = await createFlow(client, name, definition);
      print({ created: res.data?.id, name: res.data?.attributes?.name, status: res.data?.attributes?.status });
      break;
    }

    case 'flows:clone': {
      const from = requireFlag(flags, 'from');
      const exported = await getFlowWithDefinition(client, from);
      let definition = exported.data?.attributes?.definition;
      const params: FlowParams =
        typeof flags.params === 'string' ? readJson(flags.params) : {};
      const name =
        (typeof flags.name === 'string' && flags.name) ||
        params.name ||
        `${exported.data?.attributes?.name} (copia API)`;
      definition = sanitizeForCreate(applyParams(definition, params));

      if (!commit) {
        print({ dryRun: true, clonedFrom: from, name, actions: definition.actions?.length });
        console.log('\n(añade --commit para crear el clon en estado draft)');
        break;
      }
      const res = await createFlow(client, name, definition);
      print({ created: res.data?.id, name: res.data?.attributes?.name, status: res.data?.attributes?.status });
      break;
    }

    case 'flows:status': {
      const id = _[1];
      const status = _[2] as FlowStatus;
      if (!id || !['draft', 'manual', 'live'].includes(status)) {
        throw new Error('Uso: flows:status <id> <draft|manual|live> [--commit]');
      }
      if (!commit) {
        print({ dryRun: true, wouldSetStatus: { id, status } });
        console.log('\n(añade --commit para aplicar el cambio de estado)');
        break;
      }
      const res = await updateFlowStatus(client, id, status);
      print({ id: res.data?.id, status: res.data?.attributes?.status });
      break;
    }

    case 'flows:delete': {
      const id = _[1];
      if (!id) throw new Error('Uso: flows:delete <id> [--commit]');
      if (!commit) {
        print({ dryRun: true, wouldDeleteFlow: id });
        break;
      }
      await deleteFlow(client, id);
      print({ deleted: id });
      break;
    }

    case 'templates:delete': {
      const id = _[1];
      if (!id) throw new Error('Uso: templates:delete <id> [--commit]');
      if (!commit) {
        print({ dryRun: true, wouldDeleteTemplate: id });
        break;
      }
      await deleteTemplate(client, id);
      print({ deleted: id });
      break;
    }

    default:
      console.error(`Comando desconocido: ${command}\n`);
      console.log(HELP);
      process.exitCode = 1;
  }
}

main().catch((err) => {
  if (err instanceof KlaviyoError) {
    console.error(`\nError Klaviyo (HTTP ${err.status}):`);
    console.error(JSON.stringify(err.errors, null, 2));
  } else {
    console.error(`\n${err.message ?? err}`);
  }
  process.exitCode = 1;
});
