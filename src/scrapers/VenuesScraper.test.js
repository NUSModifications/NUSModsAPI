import VenuesScraper from './VenuesScraper';

describe('VenuesScraper', () => {
  const scraper = new VenuesScraper();

  describe('process', () => {
    beforeEach(async () => {
      await scraper.db.migrate.rollback();
      await scraper.db.migrate.latest();
      await scraper.db.seed.run();
    });

    it('should start out with empty db', async () => {
      expect(await scraper.db.table('venues').select('*')).toEqual([]);
    });

    it('should insert all venues if db is empty', async () => {
      const testData = [
        { school_id: 1, name: 'test', type: 'room', ownedBy: 'me' },
        { school_id: 1, name: 'test1', type: 'room', ownedBy: 'me' },
      ];
      await scraper.process([], testData);
      expect(await scraper.db.table('venues').select('*')).toEqual(testData);
    });

    it('should merge venues if db exists', async () => {
      const existingData = [
        { school_id: 1, name: 'test', type: 'room', ownedBy: 'me' },
        { school_id: 1, name: 'test1', type: 'room', ownedBy: 'me' },
      ];
      await scraper.db.table('venues').insert(existingData);
      const testData = [{ school_id: 1, name: 'test', type: 'room', ownedBy: 'me' }];
      await scraper.process(existingData, testData);
      expect(await scraper.db.table('venues').select('*')).toEqual([existingData[0]]);
    });
  });

  describe('convertToRow', () => {
    it('should convert object to sql row equivalent', async () => {
      const row = scraper.convertToRow({
        roomcode: 'test',
        roomname: 'some room',
        dept: 'subway',
      });
      expect(() => scraper.db.table('venues').insert(row)).not.toThrow();
    });

    it('should warn if there is extra props', async () => {
      scraper.log.warn = jest.fn();
      scraper.convertToRow({
        roomcode: 'test',
        roomname: 'some room',
        dept: 'subway',
        surprise: '!',
      });
      expect(scraper.log.warn).toBeCalled();
    });
  });
});
