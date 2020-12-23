import React, { ReactNode } from "react";

export interface FieldConfig {
  key: string
  type: string
  label: string
  required?: boolean
}

export interface Type<T, C> {
  new (...args: [FieldProps<C>]): T;
}
export interface IField<T> {
  set: (value: any) => Promise<void>
  get: () => Promise<any>
  validate: () => Promise<true | FieldError[]>
}
export interface IFieldStatic<T> extends Type<IField<T>, T> {
  defaults: (config: T) => any
  parse: (config: T, value: any) => any
  format: (config: T, value: any) => any
}

interface FieldProps<T> {
  config: T
}

interface FieldState<T> {
  value: any
  errors: FieldError[]
}

export class Field<T> extends React.Component<FieldProps<T>, FieldState<T>> {
  constructor (props: FieldProps<T>) {
    super(props);
    this.state = {
      value: undefined,
      errors: []
    }
  }
  render = () => {
    return (<></>)
  }
}

export class FieldError {
  message: string
  constructor(message: string) {
    this.message = message
  }
}