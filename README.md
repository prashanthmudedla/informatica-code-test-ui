# Code Test UI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.5.

This project is done to build a dynamic HTML form using Angular v9.0 and Angular Material v9.2. An HTML form has to be constructed dynamically from the provided metadata. Please look into the project code to find more details.

## Prerequisite software frameworks

Node: v12.7.0 or later

Angular CLI: v9.0.7 or later

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

To directly run the project by deploying the build, download the build files by using the link provided below.

https://github.com/prashanthmudedla/informatica-code-test-ui/files/6166968/informatica-code-test-ui.zip

## Assumptions made to complete this project

1. Field item which has the attribute "allowedValues" and datatype = "String" are shown as a dropdown control with "allowedValues" as the available control options.
2. Control's maxlength and readonly attributes are set with the metadata attributes "length" and "readonly" respectively.
3. Field with datatype "Decimal" and with attribute "fractionDigits" are applied with floating point validation. Maxlength is claculated using attributes "totalDigits" and "fractionDigits".
  If "fractionDigits" > 0 , 
    maxLength = "totalDigits" + 1 (to accomodate "." character)
    max digits before decimal point is calculated as "totalDigits" - "fractionDigits".
4. Similarly, field with datatype "integer" are applied with number validation.
5. Field with datatype "lookup" are shown as autocomplete controls using mockdata as control options. (as lookup links could not be resolved)
6. Save button is disabled when there are validation errors in the form. Validation error is shown as a generic error messgae. It might not reflect the actual error in the control.
7. Any other assumption made which is not listed above could be a common dev practise and should be understood easily when serving the application.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
