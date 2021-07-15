
import TextColumn, { TextColumnConfig } from './text'
import EnumColumn, { EnumColumnConfig } from './enum'
import NumberColumn, { NumberColumnConfig } from './number'
import NumberRangeColumn, { NumberRangeColumnConfig } from './numberRange'
import DatetimeColumn, { DatetimeColumnConfig } from './datetime'
import DatetimeRangeColumn, { DatetimeRangeColumnConfig } from './datetimeRange'
import MultirowColumn, { MultirowColumnConfig } from './multirowText'
import ImageColumn, { ImageColumnConfig } from './image'

export interface componentType {
    type: 'text'
    | 'number'
    | 'numberRange'
    | 'datetime'
    | 'datetimeRange'
    | 'Aenum'
    | 'multirowText'
    | 'image'
}

export type ColumnConfigs = TextColumnConfig
    | MultirowColumnConfig
    | DatetimeColumnConfig
    | DatetimeRangeColumnConfig
    | EnumColumnConfig
    | NumberColumnConfig
    | NumberRangeColumnConfig
    | ImageColumnConfig

export default {
  text: TextColumn,
  multirowText: MultirowColumn,
  datetime: DatetimeColumn,
  datetimeRange: DatetimeRangeColumn,
  Aenum: EnumColumn,
  number: NumberColumn,
  numberRange: NumberRangeColumn,
  image: ImageColumn
}
