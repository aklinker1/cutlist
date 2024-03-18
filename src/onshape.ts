import { createFetch } from 'ofetch';
import * as base64 from 'base64-js';

const fetch = createFetch({
  defaults: {
    baseURL: 'https://cad.onshape.com/api/v6',
  },
});
let auth: string | undefined;

function getHeaders(
  headers?: Record<string, string>,
): Record<string, string> | undefined {
  if (auth == null) return headers;
  return {
    ...headers,
    Authorization: `Basic ${auth}`,
  };
}

export const onshape = {
  setAuth(accessKey: string, secretKey: string) {
    auth = base64.fromByteArray(
      Uint8Array.from(
        `${accessKey}:${secretKey}`.split('').map((x) => x.charCodeAt(0)),
      ),
    );
  },
  getDocument: async (did: string) =>
    fetch<Onshape.Document>(`/documents/${did}`, { headers: getHeaders() }),
  getAssemblies: async (did: string, wvmid: string) =>
    fetch<Onshape.Element[]>(
      `/documents/d/${did}/w/${wvmid}/elements?elementType=Assembly`,
      { headers: getHeaders() },
    ),
  getAssemblyBom: async (did: string, wvmid: string, eid: string) =>
    fetch<Onshape.Bom>(
      `/assemblies/d/${did}/w/${wvmid}/e/${eid}/bom?indented=false`,
      {
        headers: getHeaders(),
      },
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
      { headers: getHeaders() },
    ),
};

export namespace Onshape {
  export interface Document {
    id: string;
    name: string;
    thumbnail: {
      href: string;
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
