import {
    Builder,
    fixturesIterator,
    Loader,
    Parser,
    Resolver,
} from 'typeorm-fixtures-cli/dist';
import { getConnection, getRepository } from 'typeorm';
import * as path from 'path';

const fixturesPath = 'test/fixtures';

export const loadDbFixtures = async (): Promise<void> => {
    const connection = getConnection();
    const loader = new Loader();

    loader.load(path.resolve(fixturesPath));

    const resolver = new Resolver();
    const fixtures = resolver.resolve(loader.fixtureConfigs);
    const builder = new Builder(connection, new Parser());

    for (const fixture of fixturesIterator(fixtures)) {
        const entity = (await builder.build(fixture)) as Promise<any>;
        await getRepository(entity.constructor.name).save(entity);
    }
};
