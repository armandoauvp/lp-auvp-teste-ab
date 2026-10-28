// No viewer-response, event.request é o pedido já reescrito pela função de pedido
// (/seguros/b.html para a B), então a variante servida sai do próprio URI.
function handler(event) {
  var request = event.request;
  var response = event.response;
  if (response.statusCode !== 200) return response;

  for (var i = 0; i < TESTS.length; i++) {
    var t = TESTS[i];
    var variant =
      request.uri === t.page + "b.html"
        ? "b"
        : request.uri === t.page + "index.html"
          ? "a"
          : null;
    if (!variant) continue;

    var qa = request.querystring.ab;
    var isQa = !!(qa && validVariant(qa.value));
    var c = request.cookies[cookieName(t)];
    response.headers["x-ab"] = { value: t.id + ":" + variant };
    if (isQa) response.headers["x-robots-tag"] = { value: "noindex, nofollow" };
    if (!isQa && !(c && validVariant(c.value))) {
      response.cookies = response.cookies || {};
      response.cookies[cookieName(t)] = {
        value: variant,
        attributes: "Path=/; Max-Age=" + t.d * 86400 + "; Secure; SameSite=Lax",
      };
    }
    break;
  }
  return response;
}
