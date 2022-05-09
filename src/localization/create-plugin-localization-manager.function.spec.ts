import { AgtkPluginUiCustomIdParameter, AgtkPluginUiParameterType } from '@agogpixel/pgmmv-ts/api';
import { createPluginLocalizationManager } from './create-plugin-localization-manager.function';
import { PluginLocalizationManager } from './plugin-localization-manager.interface';

describe('createPluginLocalizationManager', () => {
  it('is a function', () => expect(typeof createPluginLocalizationManager).toBe('function'));

  it('creates an object instance', () => {
    const manager = createPluginLocalizationManager({ localizations: [] });
    expect(manager).toBeTruthy();
    expect(typeof manager).toEqual('object');
  });

  describe('object instance', () => {
    let manager: PluginLocalizationManager;

    beforeEach(() => {
      manager = createPluginLocalizationManager({
        localizations: [
          {
            locale: 't1',
            data: {
              PLUGIN_NAME: 'testName1',
              PLUGIN_DESCRIPTION: 'testDescription1',
              PLUGIN_AUTHOR: 'testAuthor1',
              PLUGIN_HELP: 'testHelp1',
              fallback: 'test1'
            }
          },
          {
            locale: 't2',
            data: {
              PLUGIN_NAME: 'testName2',
              PLUGIN_DESCRIPTION: 'testDescription2',
              PLUGIN_AUTHOR: 'testAuthor2',
              PLUGIN_HELP: 'testHelp2'
            }
          }
        ]
      });
    });

    it('defaults to first loca data set for locale', () => expect(manager.getLocale()).toEqual('t1'));

    describe('locale', () => {
      it('can get & set current locale, if it exists', () => {
        expect(manager.setLocale('t2')).toEqual(true);
        expect(manager.getLocale()).toEqual('t2');
        expect(manager.setLocale('fail')).toEqual(false);
        expect(manager.setLocale('t1')).toEqual(true);
        expect(manager.getLocale()).toEqual('t1');
      });
    });

    describe('get', () => {
      it("returns 'LOCA MISSING' message if key not found in loca data & fallback data", () =>
        expect(manager.get('fail')).toEqual('LOCA MISSING: fail'));

      it('fetches an existing loca string', () => expect(manager.get('PLUGIN_NAME')).toEqual('testName1'));

      it('can use loca string from fallback data set', () => {
        expect(manager.setLocale('t2')).toEqual(true);
        expect(manager.get('fallback')).toEqual('test1');
        expect(manager.setLocale('t1')).toEqual(true);
      });

      it('processes plugin UI parameters for inline loca (string parameter type)', () => {
        const result = manager.processParameterLocale([
          {
            id: 1,
            name: 'loca(PLUGIN_DESCRIPTION)',
            type: AgtkPluginUiParameterType.String,
            defaultValue: 'loca(PLUGIN_HELP)'
          }
        ]);

        expect(result[0].name).toEqual('testDescription1');
        expect(result[0].defaultValue).toEqual('testHelp1');
      });

      it('processes plugin UI parameters for inline loca (multiline string parameter type)', () => {
        const result = manager.processParameterLocale([
          {
            id: 1,
            name: 'loca(PLUGIN_DESCRIPTION)',
            type: AgtkPluginUiParameterType.MultiLineString,
            defaultValue: 'loca(PLUGIN_HELP)'
          }
        ]);

        expect(result[0].name).toEqual('testDescription1');
        expect(result[0].defaultValue).toEqual('testHelp1');
      });

      it('processes plugin UI parameters for inline loca (custom parameter type)', () => {
        const result = manager.processParameterLocale([
          {
            id: 1,
            name: 'loca(PLUGIN_DESCRIPTION)',
            type: AgtkPluginUiParameterType.CustomId,
            defaultValue: 1,
            customParam: [
              { id: 1, name: 'loca(PLUGIN_AUTHOR)' },
              { id: 2, name: 'loca(PLUGIN_NAME)' }
            ]
          }
        ]);

        expect(result[0].name).toEqual('testDescription1');
        expect(result[0].defaultValue).toEqual(1);
        expect((result[0] as AgtkPluginUiCustomIdParameter).customParam[0].name).toEqual('testAuthor1');
        expect((result[0] as AgtkPluginUiCustomIdParameter).customParam[1].name).toEqual('testName1');
      });

      it('processes action commands for inline loca', () => {
        const result = manager.processActionCommandLocale([
          {
            id: 1,
            name: 'loca(fallback)',
            description: 'loca(PLUGIN_DESCRIPTION)',
            parameter: [
              {
                id: 1,
                name: 'loca(PLUGIN_DESCRIPTION)',
                type: AgtkPluginUiParameterType.CustomId,
                defaultValue: 1,
                customParam: [
                  { id: 1, name: 'loca(PLUGIN_AUTHOR)' },
                  { id: 2, name: 'loca(PLUGIN_NAME)' }
                ]
              }
            ]
          }
        ]);

        expect(result[0].name).toEqual('test1');
        expect(result[0].description).toEqual('testDescription1');
        expect(result[0].parameter[0].defaultValue).toEqual(1);
        expect((result[0].parameter[0] as AgtkPluginUiCustomIdParameter).customParam[0].name).toEqual('testAuthor1');
        expect((result[0].parameter[0] as AgtkPluginUiCustomIdParameter).customParam[1].name).toEqual('testName1');
      });

      it('processes link conditions for inline loca', () => {
        const result = manager.processLinkConditionLocale([
          {
            id: 1,
            name: 'loca(fallback)',
            description: 'loca(PLUGIN_DESCRIPTION)',
            parameter: [
              {
                id: 1,
                name: 'loca(PLUGIN_DESCRIPTION)',
                type: AgtkPluginUiParameterType.CustomId,
                defaultValue: 1,
                customParam: [
                  { id: 1, name: 'loca(PLUGIN_AUTHOR)' },
                  { id: 2, name: 'loca(PLUGIN_NAME)' }
                ]
              }
            ]
          }
        ]);

        expect(result[0].name).toEqual('test1');
        expect(result[0].description).toEqual('testDescription1');
        expect(result[0].parameter[0].defaultValue).toEqual(1);
        expect((result[0].parameter[0] as AgtkPluginUiCustomIdParameter).customParam[0].name).toEqual('testAuthor1');
        expect((result[0].parameter[0] as AgtkPluginUiCustomIdParameter).customParam[1].name).toEqual('testName1');
      });
    });
  });
});
