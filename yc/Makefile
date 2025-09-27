SHELL := /usr/bin/bash

YC := yc
ZIP := zip

FN_HEALTH := yc-fn-health
FN_ENV := yc-fn-env
FN_TG_SEND := yc-fn-tg-send
FN_TG_WEBHOOK := yc-fn-tg-webhook
FN_YDB_HEALTH := yc-fn-ydb-health

RUNTIME := nodejs18

.PHONY: all package deploy apigw webhook

all: package

package:
	cd functions/health && $(ZIP) -qr ../../dist-health.zip .
	cd functions/env && $(ZIP) -qr ../../dist-env.zip .
	cd functions/tg-send && $(ZIP) -qr ../../dist-tg-send.zip .
	cd functions/tg-webhook && $(ZIP) -qr ../../dist-tg-webhook.zip .
	cd functions/ydb-health && $(ZIP) -qr ../../dist-ydb-health.zip .

deploy: package
	$(YC) serverless function version create \
	  --function-name $(FN_HEALTH) \
	  --runtime $(RUNTIME) \
	  --entrypoint index.handler \
	  --execution-timeout 5s \
	  --memory 128m \
	  --source-path dist-health.zip \
	  --environment TELEGRAM_BOT_TOKEN=$$TELEGRAM_BOT_TOKEN TELEGRAM_CHAT_ID=$$TELEGRAM_CHAT_ID TELEGRAM_WEBHOOK_SECRET=$$TELEGRAM_WEBHOOK_SECRET TELEGRAM_SEND_SECRET=$$TELEGRAM_SEND_SECRET YC_REGION=$$YC_REGION YC_BUCKET=$$YC_BUCKET || true
	$(YC) serverless function version create \
	  --function-name $(FN_ENV) \
	  --runtime $(RUNTIME) \
	  --entrypoint index.handler \
	  --execution-timeout 5s \
	  --memory 128m \
	  --source-path dist-env.zip \
	  --environment TELEGRAM_BOT_TOKEN=$$TELEGRAM_BOT_TOKEN TELEGRAM_CHAT_ID=$$TELEGRAM_CHAT_ID TELEGRAM_WEBHOOK_SECRET=$$TELEGRAM_WEBHOOK_SECRET TELEGRAM_SEND_SECRET=$$TELEGRAM_SEND_SECRET YC_REGION=$$YC_REGION YC_BUCKET=$$YC_BUCKET DATABASE_URL=$$DATABASE_URL NEXTAUTH_SECRET=$$NEXTAUTH_SECRET YANDEX_CLIENT_ID=$$YANDEX_CLIENT_ID YANDEX_CLIENT_SECRET=$$YANDEX_CLIENT_SECRET || true
	$(YC) serverless function version create \
	  --function-name $(FN_TG_SEND) \
	  --runtime $(RUNTIME) \
	  --entrypoint index.handler \
	  --execution-timeout 5s \
	  --memory 128m \
	  --source-path dist-tg-send.zip \
	  --environment TELEGRAM_BOT_TOKEN=$$TELEGRAM_BOT_TOKEN TELEGRAM_CHAT_ID=$$TELEGRAM_CHAT_ID TELEGRAM_WEBHOOK_SECRET=$$TELEGRAM_WEBHOOK_SECRET TELEGRAM_SEND_SECRET=$$TELEGRAM_SEND_SECRET || true
	$(YC) serverless function version create \
	  --function-name $(FN_TG_WEBHOOK) \
	  --runtime $(RUNTIME) \
	  --entrypoint index.handler \
	  --execution-timeout 5s \
	  --memory 128m \
	  --source-path dist-tg-webhook.zip \
	  --environment TELEGRAM_BOT_TOKEN=$$TELEGRAM_BOT_TOKEN TELEGRAM_WEBHOOK_SECRET=$$TELEGRAM_WEBHOOK_SECRET TELEGRAM_SEND_SECRET=$$TELEGRAM_SEND_SECRET || true
	$(YC) serverless function version create \
	  --function-name $(FN_YDB_HEALTH) \
	  --runtime $(RUNTIME) \
	  --entrypoint index.handler \
	  --execution-timeout 5s \
	  --memory 128m \
	  --source-path dist-ydb-health.zip \
	  --environment YDB_ENDPOINT=$$YDB_ENDPOINT YDB_DATABASE=$$YDB_DATABASE YDB_DOCAPI=$$YDB_DOCAPI || true

apigw:
	$(YC) serverless api-gateway create --name kamchatour-api --spec openapi.yaml || \
	$(YC) serverless api-gateway update --name kamchatour-api --spec openapi.yaml || true

webhook:
	@test -n "$$TELEGRAM_BOT_TOKEN" || (echo "TELEGRAM_BOT_TOKEN not set" && exit 1)
	@test -n "$$TELEGRAM_WEBHOOK_URL" || (echo "TELEGRAM_WEBHOOK_URL not set" && exit 1)
	curl -s -X POST "https://api.telegram.org/bot$$TELEGRAM_BOT_TOKEN/setWebhook" \
	  -H "content-type: application/json" \
	  -d '{"url":"'"$$TELEGRAM_WEBHOOK_URL"'","secret_token":"'"$$TELEGRAM_WEBHOOK_SECRET"'"}' | jq . || true

