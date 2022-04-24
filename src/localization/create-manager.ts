import { AgtkPluginUiParameterType } from '@agogpixel/pgmmv-ts/api/agtk/plugin/plugin-ui-parameter-type';

import type { PluginLocalization } from './localization';
import type { PluginLocalizationData } from './data';
import type { PluginLocalizationManager } from './manager';
import type { PluginLocalizationManagerConfig } from './manager-config';

/**
 *
 * @param config
 * @returns
 */
export function createPluginLocalizationManager(config: PluginLocalizationManagerConfig) {
  /**
   *
   */
  const self = {} as PluginLocalizationManager;

  // Resolve configuration.
  const localizations =
    config.localizations && config.localizations.length > 0
      ? config.localizations
      : ([{ locale: 'en', data: {} }] as PluginLocalization[]);

  /**
   *
   */
  const fallbackData = localizations[0].data;

  /**
   *
   */
  let currentLocale = localizations[0].locale;

  /**
   *
   */
  const localeMap = {} as Record<string, PluginLocalizationData>;

  // Load locale map.
  for (let i = 0; i < localizations.length; ++i) {
    localeMap[localizations[i].locale] = localizations[i].data;
  }

  /**
   *
   */
  const inlineRegex = /^loca\((.+)\)$/;

  /**
   *
   * @param key
   * @returns
   */
  self.get = function get(key) {
    if (localeMap[currentLocale] && typeof localeMap[currentLocale][key] === 'string') {
      return localeMap[currentLocale][key];
    }

    if (typeof fallbackData[key] === 'string') {
      return fallbackData[key];
    }

    return `LOCA MISSING: ${key}`;
  };

  /**
   *
   * @returns
   */
  self.getLocale = function getLocale() {
    return currentLocale;
  };

  /**
   *
   * @param locale
   * @returns
   */
  self.setLocale = function setLocale(locale) {
    const loca = locale.substring(0, 2);

    if (!localeMap[loca]) {
      return false;
    }

    currentLocale = loca;
    return true;
  };

  /**
   *
   * @param parameters
   * @returns
   */
  self.processParameterLocale = function processParameterLocale(parameters) {
    for (let i = 0; i < parameters.length; ++i) {
      const parameter = parameters[i];
      let matches = parameter.name.match(inlineRegex);

      if (matches && matches.length > 1) {
        parameter.name = self.get(matches[1]);
      }

      switch (parameter.type) {
        case AgtkPluginUiParameterType.String:
        case AgtkPluginUiParameterType.MultiLineString:
          matches = parameter.defaultValue.match(inlineRegex);

          if (matches && matches.length > 1) {
            parameter.defaultValue = self.get(matches[1]);
          }

          break;
        case AgtkPluginUiParameterType.CustomId:
          for (let j = 0; j < parameter.customParam.length; ++j) {
            const param = parameter.customParam[j];

            matches = param.name.match(inlineRegex);

            if (matches && matches.length > 1) {
              param.name = self.get(matches[1]);
            }
          }

          break;
        default:
          break;
      }
    }

    return parameters;
  };

  /**
   *
   * @param executeCommands
   * @returns
   */
  self.processExecuteCommandLocale = function processExecuteCommandLocale(executeCommands) {
    for (let i = 0; i < executeCommands.length; ++i) {
      const executeCommand = executeCommands[i];
      let matches = executeCommand.name.match(inlineRegex);

      if (matches && matches.length > 1) {
        executeCommand.name = self.get(matches[1]);
      }

      matches = executeCommand.description.match(inlineRegex);

      if (matches && matches.length > 1) {
        executeCommand.description = self.get(matches[1]);
      }

      self.processParameterLocale(executeCommand.parameter);
    }

    return executeCommands;
  };

  /**
   *
   * @param linkConditions
   * @returns
   */
  self.processLinkConditionLocale = function processLinkConditionLocale(linkConditions) {
    for (let i = 0; i < linkConditions.length; ++i) {
      const linkCondition = linkConditions[i];
      let matches = linkCondition.name.match(inlineRegex);

      if (matches && matches.length > 1) {
        linkCondition.name = self.get(matches[1]);
      }

      matches = linkCondition.description.match(inlineRegex);

      if (matches && matches.length > 1) {
        linkCondition.description = self.get(matches[1]);
      }

      self.processParameterLocale(linkCondition.parameter);
    }

    return linkConditions;
  };

  return self;
}
