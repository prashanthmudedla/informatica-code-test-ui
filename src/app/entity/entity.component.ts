import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DataType, Entity, EntityMetaData, Field, Lookup } from './../model/entity.model';
import ENTITY_META_DATA from './entityMeta.json';
import ENTITY_DATA from './entityData.json';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss']
})
export class EntityComponent implements OnInit {

  entityMetaData = ENTITY_META_DATA as EntityMetaData;
  entity = ENTITY_DATA as Entity;
  entityForm: FormGroup;
  visibleFields: Field[];
  lookupDict: {[key: string]: {[x: string]: string}[]} = {};
  lookupControlSource: {[key: string]: Observable<{[x: string]: string}[]>} = {};
  @ViewChild('saveDialog') saveDialogTemplate: TemplateRef<any>;

  constructor(private fb: FormBuilder,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.visibleFields = this.getFieldsToDisplay();
    this.buildEntityForm();
  }

  get entityFieldGroups() {
    if (!this.entityMetaData || !this.entityMetaData.field || !this.entityMetaData.field.length) { return []; }
    const fieldGroups = [];
    const remainder = this.entityMetaData.field.length % 3;
    fieldGroups.push(this.entityMetaData.field.slice(0, this.entityMetaData.field.length - remainder));
    if (remainder) {
      fieldGroups.push(this.entityMetaData.field.slice(fieldGroups[0].length, this.entityMetaData.field.length));
    }
  }

  getLookupOptions(lookupMetaData: Lookup): {[x: string]: string}[] {
    if (!lookupMetaData || !lookupMetaData.link) { return []; }
    // this function tries to build a mock list of lookup options as the URI's provided are not valid!
    const lookupOptions = [
      { [lookupMetaData.key]: 'Option 1', [lookupMetaData.value]: 'Option 1' },
      { [lookupMetaData.key]: 'Option 2', [lookupMetaData.value]: 'Option 2' },
      { [lookupMetaData.key]: 'Option 3', [lookupMetaData.value]: 'Option 3' },
      { [lookupMetaData.key]: 'Option 4', [lookupMetaData.value]: 'Option 4' },
      { [lookupMetaData.key]: 'Option 5', [lookupMetaData.value]: 'Option 5' },
    ];
    return lookupOptions;
  }

  saveEntity() {
    if (this.entityForm.valid && this.saveDialogTemplate) {
      this.dialog.open(this.saveDialogTemplate, {
        data: this.buildSaveResult(),
        hasBackdrop: true,
        disableClose: true,
      });
    }
  }

  private buildSaveResult() {
    if (!this.entityMetaData || !this.entityMetaData.field) { return null; }
    const result = {};
    const $original = {};
    const formValue = this.entityForm.value;
    this.entityMetaData.field.filter(item => !item.system)
      .forEach(field => {
        result[field.name] = (formValue && formValue[field.name]) || null;
        if (this.entityForm.controls[field.name].dirty) {
          $original[field.name] = (this.entity && this.entity[field.name]) || null;
        }
      });
    return {
      ...result,
      $original,
    };
  }

  private getFieldsToDisplay() {
    if (!this.entityMetaData || !this.entityMetaData.field || !this.entityMetaData.field.length) {
      return [];
    }
    const fieldsToDisplay = this.entityMetaData.field.filter(field => !field.system) || [];
    // pad with empty fields for display purpose
    let pad = 3 - (fieldsToDisplay.length % 3);
    while (pad !== 3 && pad > 0) {
      fieldsToDisplay.push(null);
      pad--;
    }
    return fieldsToDisplay;
  }

  private buildEntityForm() {
    if (!this.entityMetaData.field) { return; }
    const group = {};
    this.entityMetaData.field.forEach(field => {
      if (!field) { return; }
      const formControl = new FormControl(this.entity ? this.entity[field.name]  || '' : '',
        this.getValidatorsForField(field));
      if (field.dataType === DataType.LOOKUP && field.lookup && field.lookup.link) {
        this.lookupDict[field.name] = this.getLookupOptions(field.lookup);
        this.lookupControlSource[field.name] = formControl.valueChanges.pipe(
          startWith(''),
          map(val => this.lookupDict[field.name].filter(option => {
            return option[field.lookup.key].toLowerCase().includes(val);
          }))
        );
      }
      group[field.name] = formControl;
    });
    this.entityForm = this.fb.group(group);
  }

  private getValidatorsForField(field: Field): ValidatorFn[] {
    if (!field) { return [Validators.nullValidator]; }
    const validators: ValidatorFn[] = [];
    if (field.required) {
      validators.push(Validators.required);
    }
    if (field.length) {
      validators.push(Validators.maxLength(field.length));
    }
    if (field.dataType === DataType.INTEGER) {
      const pattern = `^([-+])?\\d{1,${field.length}}$`;
      validators.push(Validators.pattern(pattern));
    }
    if (field.dataType === DataType.DECIMAL && field.totalDigits) {
      if (!field.fractionDigits) {
        field.fractionDigits = 0;
      }
      const pattern1 = `^([-+])?\\d{1,${field.totalDigits}}$`;
      const digitsBeforeDecimal = field.totalDigits - field.fractionDigits;
      const pattern2 = '^([-+])?' + `\\d{1,${digitsBeforeDecimal}}` + (field.fractionDigits ? `(\\.\\d{1,${field.fractionDigits}})?` : '') + '$';
      const alternateRegexPatterns = [new RegExp(pattern1), new RegExp(pattern2)];
      validators.push(Validators.pattern(new RegExp(alternateRegexPatterns.map(r => r.source).join('|'))));
    }
    return validators;
  }

}
