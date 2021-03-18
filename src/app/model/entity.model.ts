import { FormGroup } from "@angular/forms";

export interface Read {
    allowed: boolean;
}

export interface Create {
    allowed: boolean;
}

export interface Update {
    allowed: boolean;
}

export interface Operations {
    read: Read;
    create: Create;
    update: Update;
}

export interface Searchable {
    filterable: boolean;
    facet: boolean;
}

export interface Link {
    href: string;
    rel: string;
}

export interface Lookup {
    link: Link[];
    object: string;
    key: string;
    value: string;
}

export enum DataType {
  STRING = 'String',
  INTEGER = 'Integer',
  DECIMAL = 'Decimal',
  DATE = 'Date',
  LOOKUP = 'lookup'
  }

export interface Field {
    operations: Operations;
    allowedValues: string[];
    searchable: Searchable;
    name: string;
    label: string;
    dataType: DataType;
    length: number;
    trust: boolean;
    applyNullValues: boolean;
    filterable: boolean;
    sortable: boolean;
    required?: boolean;
    totalDigits?: number;
    fractionDigits?: number;
    readOnly?: boolean;
    system?: boolean;
    lookup: Lookup;
}

export interface EntityMetaData {
    field: Field[];
    name: string;
    label: string;
}

export interface Entity {
  [key: string]: string | Lookup[] | Link[];
}

export interface EntityFormField<T> {
  metadata: Field;
  value: T;
  form: FormGroup;
}

