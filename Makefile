app-migration:
	docker-compose run app npm run migration:run

app-setup:
	cp example.env .env || true
	docker-compose pull
	docker-compose build
	$(MAKE) app-migration

app:
	docker-compose up

test-migration:
	docker-compose -f docker-compose.test.yml run app npm run test:migration

test-setup:
	docker-compose -f docker-compose.test.yml up -d
	docker-compose -f docker-compose.test.yml run app npm install
	$(MAKE) test-migration

test-all:
	docker-compose -f docker-compose.test.yml run app npm run test:cov

test-ci:
	$(MAKE) test-setup
	$(MAKE) test-all

test-watch:
	docker-compose -f docker-compose.test.yml run app npm run test:watch
