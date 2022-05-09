/**
 * Exports plugin localization manager factory.
 *
 * @module localization/create-plugin-localization-manager.function
 */
import { AgtkPluginUiParameterType } from '@agogpixel/pgmmv-ts/api/agtk/plugin/plugin-ui-parameter-type';

import type { PluginLocalizationData } from './plugin-localization-data.type';
import type { PluginLocalizationManagerConfig } from './plugin-localization-manager-config.interface';
import type { PluginLocalizationManager } from './plugin-localization-manager.interface';
import type { PluginLocalization } from './plugin-localization.interface';

////////////////////////////////////////////////////////////////////////////////
// Public Static Properties
////////////////////////////////////////////////////////////////////////////////

// None.

////////////////////////////////////////////////////////////////////////////////
// Private Static Properties
////////////////////////////////////////////////////////////////////////////////

// None.

////////////////////////////////////////////////////////////////////////////////
// Public Static Methods
////////////////////////////////////////////////////////////////////////////////

/**
 * Create an object instance that provides an implementation for a plugin
 * localization manager.
 *
 * @param config Plugin localization manager configuration.
 * @returns An object instance that provides an implementation for a plugin
 * localization manager.
 * @public
 * @static
 */
export function createPluginLocalizationManager(config: PluginLocalizationManagerConfig) {
  // Public API container.
  const self = {} as PluginLocalizationManager;

  //////////////////////////////////////////////////////////////////////////////
  // Private Properties
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Localization configurations.
   *
   * @private
   */
  const localizations =
    config.localizations && config.localizations.length > 0
      ? config.localizations
      : ([{ locale: 'en', data: {} }] as PluginLocalization[]);

  /**
   * Localization fallback data.
   *
   * @private
   */
  const fallbackData = localizations[0].data;

  /**
   * Current locale.
   *
   * @private
   */
  let currentLocale = localizations[0].locale;

  /**
   * Maps locale prefix to localization data.
   *
   * @private
   */
  const localeMap = {} as Record<string, PluginLocalizationData>;

  // Load locale map.
  for (let i = 0; i < localizations.length; ++i) {
    localeMap[localizations[i].locale] = localizations[i].data;
  }

  /**
   * Inline locale regex for text replacement.
   *
   * @private
   */
  const inlineRegex = /^loca\((.+)\)$/;

  //////////////////////////////////////////////////////////////////////////////
  // Private Methods
  //////////////////////////////////////////////////////////////////////////////

  // None.

  //////////////////////////////////////////////////////////////////////////////
  // Protected Properties
  //////////////////////////////////////////////////////////////////////////////

  // None.

  //////////////////////////////////////////////////////////////////////////////
  // Protected Methods
  //////////////////////////////////////////////////////////////////////////////

  // None.

  //////////////////////////////////////////////////////////////////////////////
  // Public Properties
  //////////////////////////////////////////////////////////////////////////////

  // None.

  //////////////////////////////////////////////////////////////////////////////
  // Public Methods
  //////////////////////////////////////////////////////////////////////////////

  self.get = function (key) {
    const loca = currentLocale.substring(0, 2);

    if (localeMap[loca] && typeof localeMap[loca][key] === 'string') {
      return localeMap[loca][key];
    }

    if (typeof fallbackData[key] === 'string') {
      return fallbackData[key];
    }

    return `LOCA MISSING: ${key}`;
  };

  self.getLocale = function () {
    return currentLocale;
  };

  self.setLocale = function (locale) {
    if (!localeMap[locale.substring(0, 2)]) {
      return false;
    }

    currentLocale = locale;
    return true;
  };

  self.processParameterLocale = function (parameters) {
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

  self.processActionCommandLocale = function (actionCommands) {
    for (let i = 0; i < actionCommands.length; ++i) {
      const executeCommand = actionCommands[i];
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

    return actionCommands;
  };

  self.processLinkConditionLocale = function (linkConditions) {
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

////////////////////////////////////////////////////////////////////////////////
// Private Static Methods
////////////////////////////////////////////////////////////////////////////////

// None.
