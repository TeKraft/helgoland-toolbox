# How Tos

To get in touch with the helgoland-toolbox, here you will find a list of how tos:

- [Wrap D3 timeseries component as angular-element](./how-tos/d3-wrapper-element.md.html)
- [Integrate a D3 timeseries component](./how-tos/integrate-a-d3-timeseries-component.html)
- [Integrate a table component](./how-tos/integrate-a-table-component.html)
- [Integrate a map component](./how-tos/integrate-map.html)
- [Extend a timeseries entry component](./how-tos/extend-a-timeseries-entry-component.html)
- [Configure a map component](./how-tos/configure-map-component.html)
- [Using basic auth services](./how-tos/basic-auth-services.html)
- [Handle styling options for datasets](../how-tos/handle-styling-options.html)
- [Add last value map selector](../how-tos/add-last-value-map-selector.html)
- [Using new communication interface](../how-tos/using-new-communication-interface.html)

### Preparing a how to app with angular-cli

Starting from the very beginning in setting up the ng-app, angular-cli needs to be installed with npm. If you already have a running project skip this step and start with one of the how-tos.

Following the instructions of the [angular quickstart guide](https://angular.io/guide/quickstart) a new ng-app will be created with its folder-structure.
Open a terminal and change the working directory to the supposed location, where you want to create your ng-app with an integrated D3 timeseries component. In this tutorial the new ng-app will be named `helgoland-how-to`.

| Step                   | Command                       |
|------------------------|-------------------------------|
| Install angular-cli    | `npm install -g @angular/cli` |
| Create ng-app          | `ng new helgoland-how-to`     |
| Change into app-folder | `cd helgoland-how-to`         |
| Start app              | `ng serve`                    |

#### Suggestions for error handling

- `Cannot find module '@angular-devkit/core'` click [here](https://github.com/angular/angular-cli/issues/9307)