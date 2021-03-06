import { AgtkPlugin, AgtkPluginInfoCategory, AgtkPluginUiParameterType } from '@agogpixel/pgmmv-ts/api/agtk/plugin';

import { createPlugin } from './create-plugin.function';
import { PluginLocalizationRequiredKey } from './localization';
import type { PluginProtectedApi } from './plugin-protected-api.interface';

describe('createPlugin', () => {
  it('is a function', () => expect(typeof createPlugin).toBe('function'));

  it('creates a default plugin object with empty loca, no other options', () =>
    expect(createPlugin({ localizations: [] })).toBeTruthy());

  describe('general default plugin behavior', () => {
    let plugin: AgtkPlugin;
    let pluginInternal: PluginProtectedApi;

    beforeEach(() => {
      pluginInternal = {} as PluginProtectedApi;
      plugin = createPlugin({ localizations: [] }, pluginInternal);
    });

    describe('setLocale', () => {
      it('has method', () => expect(typeof plugin.setLocale).toBe('function'));

      it('calls internalApi.localization.setLocale', () => {
        const internalSetLocaleSpy = jest.spyOn(pluginInternal.localization, 'setLocale');
        plugin.setLocale('en');
        expect(internalSetLocaleSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('getInfo', () => {
      it('has method', () => expect(typeof plugin.getInfo).toBe('function'));

      it(`supports: ${AgtkPluginInfoCategory.Name}`, () => {
        const internalLocaGetSpy = jest.spyOn(pluginInternal.localization, 'get');
        const name = plugin.getInfo(AgtkPluginInfoCategory.Name);
        expect(name).toBe(`LOCA MISSING: ${PluginLocalizationRequiredKey.Name}`);
        expect(internalLocaGetSpy).toHaveBeenCalledTimes(1);
      });

      it(`supports: ${AgtkPluginInfoCategory.Description}`, () => {
        const internalLocaGetSpy = jest.spyOn(pluginInternal.localization, 'get');
        const description = plugin.getInfo(AgtkPluginInfoCategory.Description);
        expect(description).toBe(`LOCA MISSING: ${PluginLocalizationRequiredKey.Description}`);
        expect(internalLocaGetSpy).toHaveBeenCalledTimes(1);
      });

      it(`supports: ${AgtkPluginInfoCategory.Author}`, () => {
        const internalLocaGetSpy = jest.spyOn(pluginInternal.localization, 'get');
        const author = plugin.getInfo(AgtkPluginInfoCategory.Author);
        expect(author).toBe(`LOCA MISSING: ${PluginLocalizationRequiredKey.Author}`);
        expect(internalLocaGetSpy).toHaveBeenCalledTimes(1);
      });

      it(`supports: ${AgtkPluginInfoCategory.Help}`, () => {
        const internalLocaGetSpy = jest.spyOn(pluginInternal.localization, 'get');
        const help = plugin.getInfo(AgtkPluginInfoCategory.Help);
        expect(help).toBe(`LOCA MISSING: ${PluginLocalizationRequiredKey.Help}`);
        expect(internalLocaGetSpy).toHaveBeenCalledTimes(1);
      });

      it(`supports: ${AgtkPluginInfoCategory.Parameter}`, () => {
        const internalGetInfoParameterSpy = jest.spyOn(pluginInternal, 'getInfoParameter');
        const parameter = plugin.getInfo(AgtkPluginInfoCategory.Parameter);
        expect(Array.isArray(parameter)).toBe(true);
        expect(parameter.length).toBe(0);
        expect(internalGetInfoParameterSpy).toHaveBeenCalledTimes(1);
      });

      it(`supports: ${AgtkPluginInfoCategory.Internal}`, () => {
        const internalGetInfoInternalSpy = jest.spyOn(pluginInternal, 'getInfoInternal');
        const data = plugin.getInfo(AgtkPluginInfoCategory.Internal);
        expect(typeof data).toBe('object');
        expect(data).not.toBeNull();
        expect(internalGetInfoInternalSpy).toHaveBeenCalledTimes(1);
      });

      it(`supports: ${AgtkPluginInfoCategory.ActionCommand}`, () => {
        const internalGetInfoActionCommandSpy = jest.spyOn(pluginInternal, 'getInfoActionCommand');
        const actionCommand = plugin.getInfo(AgtkPluginInfoCategory.ActionCommand);
        expect(Array.isArray(actionCommand)).toBe(true);
        expect(actionCommand.length).toBe(0);
        expect(internalGetInfoActionCommandSpy).toHaveBeenCalledTimes(1);
      });

      it(`supports: ${AgtkPluginInfoCategory.LinkCondition}`, () => {
        const internalGetInfoLinkConditionSpy = jest.spyOn(pluginInternal, 'getInfoLinkCondition');
        const linkCondition = plugin.getInfo(AgtkPluginInfoCategory.LinkCondition);
        expect(Array.isArray(linkCondition)).toBe(true);
        expect(linkCondition.length).toBe(0);
        expect(internalGetInfoLinkConditionSpy).toHaveBeenCalledTimes(1);
      });

      it(`supports (not really): ${AgtkPluginInfoCategory.AutoTile}`, () => {
        const internalGetInfoAutoTileSpy = jest.spyOn(pluginInternal, 'getInfoAutoTile');
        const autoTile = plugin.getInfo(AgtkPluginInfoCategory.AutoTile);
        expect(autoTile).toBeUndefined();
        expect(internalGetInfoAutoTileSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('initialize', () => {
      it('has method', () => expect(typeof plugin.initialize).toBe('function'));

      it('calls setInternal when given truthy data', () => {
        const setInternalSpy = jest.spyOn(plugin, 'setInternal');
        plugin.initialize(undefined);
        expect(setInternalSpy).not.toHaveBeenCalled();
        plugin.initialize({ key: 'value' });
        expect(setInternalSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('finalize', () => {
      it('has method', () => expect(typeof plugin.finalize).toBe('function'));
      it('is callable', () => expect(plugin.finalize()).toBeUndefined());
    });

    describe('setParamValue', () => {
      it('has method', () => expect(typeof plugin.setParamValue).toBe('function'));
      it('is callable', () => expect(plugin.setParamValue([])).toBeUndefined());
    });

    describe('setInternal', () => {
      it('has method', () => expect(typeof plugin.setInternal).toBe('function'));

      it('sets internal data when given truthy data', () => {
        const originalInternalData = pluginInternal.internalData;
        plugin.setInternal(false);
        expect(pluginInternal.internalData).toEqual(originalInternalData);
        plugin.setInternal({ key: 'value' });
        expect(pluginInternal.internalData).not.toEqual(originalInternalData);
      });
    });

    describe('call', () => {
      it('has method', () => expect(typeof plugin.call).toBe('function'));
      it('is callable', () => expect(plugin.call()).toBeUndefined());
    });
  });

  describe('extras', () => {
    let pluginInternal: PluginProtectedApi;

    beforeEach(() => {
      pluginInternal = {} as PluginProtectedApi;
      createPlugin(
        {
          localizations: [],
          parameters: [
            {
              id: 1,
              name: 'testPluginParameter1',
              type: AgtkPluginUiParameterType.TextId,
              defaultValue: -1,
              withNewButton: true
            },
            {
              id: 2,
              name: 'testPluginParameter2',
              type: AgtkPluginUiParameterType.TextId,
              defaultValue: -2,
              withNewButton: true
            }
          ],
          actionCommands: [
            {
              id: 1,
              name: 'testActionCommand1',
              description: 'testActionCommand1',
              parameter: [
                {
                  id: 1,
                  name: 'testActionCommandParameter1',
                  type: AgtkPluginUiParameterType.TextId,
                  defaultValue: -1,
                  withNewButton: true
                },
                {
                  id: 2,
                  name: 'testActionCommandParameter2',
                  type: AgtkPluginUiParameterType.TextId,
                  defaultValue: -2,
                  withNewButton: true
                }
              ]
            }
          ],
          linkConditions: [
            {
              id: 1,
              name: 'testLinkCondition1',
              description: 'testLinkCondition1',
              parameter: [
                {
                  id: 1,
                  name: 'testLinkConditionParameter1',
                  type: AgtkPluginUiParameterType.TextId,
                  defaultValue: -1,
                  withNewButton: true
                },
                {
                  id: 2,
                  name: 'testLinkConditionParameter2',
                  type: AgtkPluginUiParameterType.TextId,
                  defaultValue: -2,
                  withNewButton: true
                }
              ]
            }
          ]
        },
        pluginInternal
      );
    });

    describe('internalApi', () => {
      describe('inEditor', () => {
        it('has method', () => expect(typeof pluginInternal.inEditor).toBe('function'));

        it('returns true if global Agtk object not found', () => {
          (global as unknown as Record<string, unknown>)['Agtk'] = undefined;
          expect(pluginInternal.inEditor()).toBe(true);
          delete (global as unknown as Record<string, unknown>)['Agtk'];
        });

        it('returns true if global Agtk object does not have a log method', () => {
          (global as unknown as Record<string, unknown>)['Agtk'] = { log: undefined };
          expect(pluginInternal.inEditor()).toBe(true);
          delete (global as unknown as Record<string, unknown>)['Agtk'];
        });

        it('returns false if global Agtk object that has log method is found', () => {
          (global as unknown as Record<string, unknown>)['Agtk'] = { log: console.log };
          expect(pluginInternal.inEditor()).toBe(false);
          delete (global as unknown as Record<string, unknown>)['Agtk'];
        });
      });

      describe('inPlayer', () => {
        it('has method', () => expect(typeof pluginInternal.inPlayer).toBe('function'));

        it('returns false if global Agtk object not found', () => {
          (global as unknown as Record<string, unknown>)['Agtk'] = undefined;
          expect(pluginInternal.inPlayer()).toBe(false);
          delete (global as unknown as Record<string, unknown>)['Agtk'];
        });

        it('returns false if global Agtk object does not have a version that matches /^player .+$/', () => {
          (global as unknown as Record<string, unknown>)['Agtk'] = { version: undefined };
          expect(pluginInternal.inPlayer()).toBe(false);

          (global as unknown as Record<string, unknown>)['Agtk'] = { version: 'testing' };
          expect(pluginInternal.inPlayer()).toBe(false);

          delete (global as unknown as Record<string, unknown>)['Agtk'];
        });

        it('returns true if global Agtk object that has version that matches /^player .+$/ is found', () => {
          (global as unknown as Record<string, unknown>)['Agtk'] = { version: 'player testing' };
          expect(pluginInternal.inPlayer()).toBe(true);
          delete (global as unknown as Record<string, unknown>)['Agtk'];
        });
      });

      describe('normalizeActionCommandParameters', () => {
        it('has method', () => expect(typeof pluginInternal.normalizeActionCommandParameters).toBe('function'));

        it('normalizes to an object & sets missing parameters with default values', () => {
          let result = pluginInternal.normalizeActionCommandParameters(0, []);
          expect(Object.keys(result).length).toEqual(2);
          expect(result[1]).toEqual(-1);
          expect(result[2]).toEqual(-2);

          result = pluginInternal.normalizeActionCommandParameters(0, [{ id: 1, value: 1 }]);
          expect(Object.keys(result).length).toEqual(2);
          expect(result[1]).toEqual(1);
          expect(result[2]).toEqual(-2);

          result = pluginInternal.normalizeActionCommandParameters(0, [{ id: 2, value: 2 }]);
          expect(Object.keys(result).length).toEqual(2);
          expect(result[1]).toEqual(-1);
          expect(result[2]).toEqual(2);

          result = pluginInternal.normalizeActionCommandParameters(0, [
            { id: 1, value: 1 },
            { id: 2, value: 2 }
          ]);
          expect(Object.keys(result).length).toEqual(2);
          expect(result[1]).toEqual(1);
          expect(result[2]).toEqual(2);
        });
      });

      describe('normalizeLinkConditionParameters', () => {
        it('has method', () => expect(typeof pluginInternal.normalizeLinkConditionParameters).toBe('function'));

        it('normalizes to an object & sets missing parameters with default values', () => {
          let result = pluginInternal.normalizeLinkConditionParameters(0, []);
          expect(Object.keys(result).length).toEqual(2);
          expect(result[1]).toEqual(-1);
          expect(result[2]).toEqual(-2);

          result = pluginInternal.normalizeLinkConditionParameters(0, [{ id: 1, value: 1 }]);
          expect(Object.keys(result).length).toEqual(2);
          expect(result[1]).toEqual(1);
          expect(result[2]).toEqual(-2);

          result = pluginInternal.normalizeLinkConditionParameters(0, [{ id: 2, value: 2 }]);
          expect(Object.keys(result).length).toEqual(2);
          expect(result[1]).toEqual(-1);
          expect(result[2]).toEqual(2);

          result = pluginInternal.normalizeLinkConditionParameters(0, [
            { id: 1, value: 1 },
            { id: 2, value: 2 }
          ]);
          expect(Object.keys(result).length).toEqual(2);
          expect(result[1]).toEqual(1);
          expect(result[2]).toEqual(2);
        });
      });

      describe('normalizeUiParameters', () => {
        it('has method', () => expect(typeof pluginInternal.normalizeUiParameters).toBe('function'));

        it('normalizes to an object & sets missing parameters with default values', () => {
          let result = pluginInternal.normalizeUiParameters([]);
          expect(Object.keys(result).length).toEqual(2);
          expect(result[1]).toEqual(-1);
          expect(result[2]).toEqual(-2);

          result = pluginInternal.normalizeUiParameters([{ id: 1, value: 1 }]);
          expect(Object.keys(result).length).toEqual(2);
          expect(result[1]).toEqual(1);
          expect(result[2]).toEqual(-2);

          result = pluginInternal.normalizeUiParameters([{ id: 2, value: 2 }]);
          expect(Object.keys(result).length).toEqual(2);
          expect(result[1]).toEqual(-1);
          expect(result[2]).toEqual(2);

          result = pluginInternal.normalizeUiParameters([
            { id: 1, value: 1 },
            { id: 2, value: 2 }
          ]);
          expect(Object.keys(result).length).toEqual(2);
          expect(result[1]).toEqual(1);
          expect(result[2]).toEqual(2);
        });

        it('ensures default JSON parameter values are stringified', () => {
          const internal = {} as PluginProtectedApi;
          createPlugin(
            {
              localizations: [],
              parameters: [{ id: 1, name: 'test', type: AgtkPluginUiParameterType.Json, defaultValue: ['test'] }]
            },
            internal
          );

          const result = internal.normalizeUiParameters([]);
          expect(Object.keys(result).length).toEqual(1);
          expect(result[1]).toEqual('["test"]');
        });
      });
    });
  });
});
