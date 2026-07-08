/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 5 });

export const renderProductSEO = onRequest(async (request, response) => {
  try {
    // Pega o ID da URL (ex: /produto/12345 -> 12345)
    const parts = request.path.split('/').filter(Boolean);
    const productId = parts[parts.length - 1];

    // Carrega o HTML base do SPA
    let html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

    if (productId && productId !== 'produto') {
      const docSnap = await admin.firestore().collection('products').doc(productId).get();
      if (docSnap.exists) {
        const product = docSnap.data();
        const title = product?.title || 'Sabor & Sonhos';
        const description = product?.description || 'As melhores cestas para presentear.';
        const image = product?.images?.[0]?.url || product?.imageUrl || '';
        const currentUrl = `https://${request.hostname}${request.path}`;

        // Injeta as informações do produto nas meta tags falsas
        html = html
          .replace(/__SEO_TITLE__/g, `${title} - Sabor & Sonhos`)
          .replace(/__SEO_DESCRIPTION__/g, description)
          .replace(/__SEO_IMAGE__/g, image)
          .replace(/__SEO_URL__/g, currentUrl);
      }
    }

    // Cache no CDN (Hosting) por 10 minutos
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    response.status(200).send(html);
  } catch (error) {
    console.error("Erro renderProductSEO:", error);
    try {
      const fallbackHtml = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
      response.status(200).send(fallbackHtml);
    } catch(e) {
      response.status(500).send("Erro interno");
    }
  }
});
