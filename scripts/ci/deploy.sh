#!/usr/bin/env bash
# Publica dist/ no S3, atualiza as funções de borda e invalida o cache.
# Ordem: arquivos novos -> funções -> remoção dos antigos, para nenhum visitante cair numa
# variante B que já foi apagada nem numa A/B que ainda não existe.
set -euo pipefail

: "${SITE_NAME:?}" "${SITE_DISTRIBUTION_ID:?}"

# Nomes definidos no Terraform (terraform/main.tf): bucket (já existente) = nome, funções = nome-request/-response.
SITE_BUCKET=$SITE_NAME

publish_function() {
  local name=$1 file=$2 etag
  etag=$(aws cloudfront describe-function --name "$name" --stage DEVELOPMENT --query ETag --output text)
  etag=$(aws cloudfront update-function --name "$name" --if-match "$etag" \
    --function-config "Comment=publicado pelo deploy,Runtime=cloudfront-js-2.0" \
    --function-code "fileb://$file" --query ETag --output text)
  aws cloudfront publish-function --name "$name" --if-match "$etag" > /dev/null
}

# assets/ tem nome com hash e nunca é apagado: páginas em cache podem ainda apontar para os antigos.
aws s3 sync dist/assets "s3://${SITE_BUCKET}/assets" --only-show-errors
aws s3 sync dist "s3://${SITE_BUCKET}" --exclude "assets/*" --only-show-errors

publish_function "${SITE_NAME}-request" edge/dist/request.js
publish_function "${SITE_NAME}-response" edge/dist/response.js

aws s3 sync dist "s3://${SITE_BUCKET}" --exclude "assets/*" --delete --only-show-errors
aws cloudfront create-invalidation --distribution-id "$SITE_DISTRIBUTION_ID" --paths '/*' > /dev/null
echo "Publicado: $(git rev-parse --short HEAD)"
