import type { PartToCut } from './types';
import type { $Fetch } from 'ofetch';
import { createFetch } from 'ofetch';
import * as base64 from 'base64-js';
import consola from 'consola';
import { p } from '@antfu/utils';

export interface OnshapeLoader {
  getParts(url: string): Promise<PartToCut[]>;
  getParts(ids: OnshapeProjectIds): Promise<PartToCut[]>;
  getDocument(did: string): Promise<Onshape.Document>;
  fetch: $Fetch;
}

export function defineOnshapeLoader(config?: OnshapeApiConfig): OnshapeLoader {
  const api = defineOnshapeApi(config);

  const getIds = (arg0: string | OnshapeProjectIds): OnshapeProjectIds =>
    typeof arg0 === 'string' ? parseOnshapeUrl(arg0) : arg0;

  const getBom = async (ids: OnshapeProjectIds) => {
    if (ids.wvmid == null) {
      const document = await api.getDocument(ids.did);
      ids.wvmid = document.defaultWorkspace.id;
    }
    return await api.getAssemblyBom(ids.did, ids.wvmid, ids.eid);
  };

  const getPartsToCut = async (bom: Onshape.Bom): Promise<PartToCut[]> => {
    const quantityHeaderId = bom.headers.find(
      (header) => header.propertyName === 'quantity',
    )?.id;
    if (quantityHeaderId == null) {
      consola.log('Headers:', bom.headers);
      throw Error('Could not find quantity column in BOM');
    }

    const nameHeaderId = bom.headers.find(
      (header) => header.propertyName === 'name',
    )?.id;
    if (nameHeaderId == null) {
      consola.log('Headers:', bom.headers);
      throw Error('Could not find name column in BOM');
    }

    const materialHeaderId = bom.headers.find(
      (header) => header.propertyName === 'material',
    )?.id;
    if (materialHeaderId == null) {
      consola.log('Headers:', bom.headers);
      throw Error('Could not find material column in BOM');
    }

    consola.info(`Loading part details: ${bom.rows.length}`);
    const partGroups = await p(bom.rows)
      .map(async ({ itemSource, headerIdToValue }) => {
        const bounds = await api.getPartBoundingBox(
          itemSource.documentId,
          itemSource.wvmType,
          itemSource.wvmId,
          itemSource.elementId,
          itemSource.partId,
        );
        const material = headerIdToValue[materialHeaderId] as any;
        return {
          size: {
            width: bounds.highY - bounds.lowY,
            length: bounds.highX - bounds.lowX,
            thickness: bounds.highZ - bounds.lowZ,
          },
          quantity: Number(headerIdToValue[quantityHeaderId]),
          name: String(headerIdToValue[nameHeaderId]),
          material: material?.displayName ?? 'Unknown',
        };
      })
      .map((info, infoI) =>
        Array.from({ length: info.quantity }).map<PartToCut>((_, i) => ({
          name: info.name,
          partNumber: infoI + 1,
          instanceNumber: i + 1,
          size: info.size,
          material: info.material,
        })),
      ).promise;
    const parts = partGroups.flat();
    consola.info('Total parts:', parts.length);
    return parts.flat();
  };

  return {
    fetch: api.fetch,
    getParts: async (arg0) => {
      const ids = getIds(arg0);
      const bom = await getBom(ids);
      return await getPartsToCut(bom);
    },
    getDocument: async (did) => api.getDocument(did),
  };
}

function defineOnshapeApi(config?: OnshapeApiConfig) {
  const getAuthHeaders = () => {
    if (config?.auth == null) return undefined;

    const encoded = base64.fromByteArray(
      Uint8Array.from(
        `${config.auth.accessKey}:${config.auth.secretKey}`
          .split('')
          .map((x) => x.charCodeAt(0)),
      ),
    );
    return {
      Authorization: `Basic ${encoded}`,
    };
  };
  const fetch = createFetch({
    defaults: {
      baseURL: config?.baseUrl ?? 'https://cad.onshape.com/api/v6',
      headers: getAuthHeaders(),
      onResponseError(context) {
        consola.error(context.response._data);
      },
    },
  });

  return {
    fetch,
    getAuthHeaders,
    getDocument: async (did: string) =>
      fetch<Onshape.Document>(`/documents/${did}`),
    getAssemblies: async (did: string, wvmid: string) =>
      fetch<Onshape.Element[]>(
        `/documents/d/${did}/w/${wvmid}/elements?elementType=Assembly`,
      ),
    getAssemblyBom: async (did: string, wvmid: string, eid: string) =>
      fetch<Onshape.Bom>(
        `/assemblies/d/${did}/w/${wvmid}/e/${eid}/bom?indented=false`,
      ),
    getPartBoundingBox: async (
      did: string,
      wvm: string,
      wvmid: string,
      eid: string,
      partid: string,
    ) =>
      fetch<Onshape.BoundingBox>(
        `/parts/d/${did}/${wvm}/${wvmid}/e/${eid}/partid/${partid}/boundingboxes`,
      ),
  };
}

namespace Onshape {
  export interface Document {
    id: string;
    name: string;
    thumbnail: {
      href: string;
    };
    owner: {
      name: string;
    };
    defaultWorkspace: {
      id: string;
      name: string;
    };
  }

  export interface Element {
    name: string;
    id: string;
    lengthUnits: 'inch';
    angleUnits: 'degree';
    massUnits: 'pound';
  }

  export interface Bom {
    rows: Array<{
      itemSource: {
        documentId: string;
        elementId: string;
        partId: string;
        wvmType: string;
        wvmId: string;
      };
      headerIdToValue: Record<string, unknown>;
    }>;
    headers: Array<{
      propertyName: string;
      id: string;
    }>;
  }

  export interface BoundingBox {
    lowY: number;
    lowZ: number;
    highX: number;
    highY: number;
    highZ: number;
    lowX: number;
  }
}

/**
 * Return the project IDs based on a URL, or throw an error if invalid.
 */
export function parseOnshapeUrl(url: string): OnshapeProjectIds {
  const path = new URL(url).pathname;
  const matches =
    /^\/documents\/(?<did>.*?)\/.*?\/(?<wvmid>.*?)\/e\/(?<eid>.*?)$/.exec(path);
  if (matches?.groups == null)
    throw Error('Onshape URL does not have a valid path: ' + path);

  return {
    did: matches.groups.did,
    wvmid: matches.groups.wvmid,
    eid: matches.groups.eid,
  };
}

/**
 * Apart of the project's URL when opened in your browser:
 * ```
 * https://cad.onshape.com/documents/{did}/w/{wvmid}/e/{eid}
 * ```
 */
export interface OnshapeProjectIds {
  /**
   * Apart of the project's URL when opened in your browser:
   * ```
   * https://cad.onshape.com/documents/{did}/w/{wvmid}/e/{eid}
   * ```
   */
  did: string;
  /**
   * Apart of the project's URL when opened in your browser:
   * ```
   * https://cad.onshape.com/documents/{did}/w/{wvmid}/e/{eid}
   * ```
   */
  wvmid?: string;
  /**
   * Apart of the project's URL when opened in your browser:
   * ```
   * https://cad.onshape.com/documents/{did}/w/{wvmid}/e/{eid}
   * ```
   */
  eid: string;
}

/**
 * Create or get from <https://dev-portal.onshape.com/keys>.
 */
export interface OnshapeAuth {
  /**
   * Create or get from <https://dev-portal.onshape.com/keys>.
   */
  accessKey: string;
  /**
   * Create or get from <https://dev-portal.onshape.com/keys>.
   */
  secretKey: string;
}

export interface OnshapeApiConfig {
  baseUrl?: string;
  auth?: OnshapeAuth;
}
