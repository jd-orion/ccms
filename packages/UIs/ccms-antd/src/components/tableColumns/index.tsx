import React from "react"
import TextColumns from './text'
import DatetimeColumns from './datetime'
import DatetimeRangeColumns from './datetimeRange'
import NumberColumn from "./number"
import NumberRangeColumn from "./numberRange"
import MultirowColumn from "./multirowText"
import EnumColumn from './enum'

export default {
    text: TextColumns,
    datetime: DatetimeColumns,
    datetimeRange: DatetimeRangeColumns,
    number: NumberColumn,
    numberRange: NumberRangeColumn,
    multirowText: MultirowColumn,
    Aenum: EnumColumn
}
