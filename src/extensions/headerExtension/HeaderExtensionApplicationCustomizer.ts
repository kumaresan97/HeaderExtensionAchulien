// import { Log } from "@microsoft/sp-core-library";
// import {
//   BaseApplicationCustomizer,
//   PlaceholderContent,
//   PlaceholderName,
// } from "@microsoft/sp-application-base";
// import { Dialog } from "@microsoft/sp-dialog";
// import * as ReactDOM from "react-dom";
// import * as React from "react";

// import * as strings from "HeaderExtensionApplicationCustomizerStrings";

// const LOG_SOURCE: string = "HeaderExtensionApplicationCustomizer";
// import ReactHeader from "./ReactFooter";
// import { sp } from "@pnp/sp/presets/all";

// /**
//  * If your command set uses the ClientSideComponentProperties JSON input,
//  * it will be deserialized into the BaseExtension.properties object.
//  * You can define an interface to describe it.
//  */
// export interface IHeaderExtensionApplicationCustomizerProperties {
//   // This is an example; replace with your own property
//   testMessage: string;
// }

// /** A Custom Action which can be run during execution of a Client Side Application */
// export default class HeaderExtensionApplicationCustomizer extends BaseApplicationCustomizer<IHeaderExtensionApplicationCustomizerProperties> {
//   private _topPlaceholder: any;

//   public onInit(): Promise<void> {
//     sp.setup({
//       spfxContext: this.context,
//     });
//     Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

//     let message: string = this.properties.testMessage;
//     if (!message) {
//       message = "(No properties were provided.)";
//     }

//     // Dialog.alert(`Hello from ${strings.Title}:\n\n${message}`);
//     this._renderPlaceholders();
//     return Promise.resolve();
//   }

//   private _renderPlaceholders() {
//     // Check if the top placeholder is already set
//     if (!this._topPlaceholder) {
//       this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
//         PlaceholderName.Top
//       );
//       // Check if the placeholder is available and render the React component
//       if (this._topPlaceholder) {
//         const element = React.createElement(ReactHeader);
//         debugger;
//         ReactDOM.render(element, this._topPlaceholder.domElement);
//       }
//     }
//   }
// }

import { Log } from "@microsoft/sp-core-library";
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName,
} from "@microsoft/sp-application-base";
import { Dialog } from "@microsoft/sp-dialog";
import * as ReactDOM from "react-dom";
import * as React from "react";

import * as strings from "HeaderExtensionApplicationCustomizerStrings";

const LOG_SOURCE: string = "HeaderExtensionApplicationCustomizer";
import ReactHeader from "./ReactFooter";
import { sp } from "@pnp/sp/presets/all";

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IHeaderExtensionApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class HeaderExtensionApplicationCustomizer extends BaseApplicationCustomizer<IHeaderExtensionApplicationCustomizerProperties> {
  private _topPlaceholder: PlaceholderContent | undefined;

  public onInit(): Promise<void> {
    sp.setup({
      spfxContext: this.context,
    });
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    let message: string = this.properties.testMessage;
    if (!message) {
      message = "(No properties were provided.)";
    }

    this._renderPlaceholders();
    return Promise.resolve();
  }

  private _renderPlaceholders() {
    // Check if the top placeholder is already set
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top
      );

      // Check if the placeholder is available and render the React component
      if (this._topPlaceholder && this._topPlaceholder.domElement) {
        const element = React.createElement(ReactHeader);
        ReactDOM.render(element, this._topPlaceholder.domElement);
      }
    }
  }
}
