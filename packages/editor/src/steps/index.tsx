import { Config as FetchStepConfig, Template as FetchStepTemplate } from "./fetch"
import { Config as FormStepConfig, Template as FormStepTemplate } from "./form"
import { Config as TableStepConfig, Template as TableStepTemplate } from "./table"
import { Config as FilterStepConfig, Template as FilterStepTemplate } from "./filter"
import { Config as SkipStepConfig, Template as SkipStepTemplate } from "./skip"
import { Config as HeaderStepConfig, Template as HeaderStepTemplate } from "./header"
import { Config as DetailStepConfig, Template as DetailStepTemplate } from "./detail"
import { StepConfigs as IStepConfigs  } from "ccms/dist/steps"

// 页面配置数据
export const StepConfigs = {
  fetch: FetchStepConfig,
  form: FormStepConfig,
  table: TableStepConfig,
  filter: FilterStepConfig,
  skip: SkipStepConfig,
  header: HeaderStepConfig,
  detail: DetailStepConfig
}

// 页面配置模板
export const StepTemplates: { [type: string]: IStepConfigs } = {
  fetch: FetchStepTemplate,
  form: FormStepTemplate,
  table: TableStepTemplate,
  filter: FilterStepTemplate,
  skip: SkipStepTemplate,
  header: HeaderStepTemplate,
  detail: DetailStepTemplate
}

// 页面类型列表
export type PageTemplate = 'normal-table' | 'filter-table' | 'normal-form' | 'edit-form' | 'detail' | 'opera'


// 页面类型数据
export const PageTemplates = {
  'normal-table': [
    { label: '页面信息', step: 'header' },
    { label: '接口信息', step: 'fetch' },
    { label: '列表信息', step: 'table' }
  ],
  'filter-table': [
    { label: '页面信息', step: 'header' },
    { label: '筛选信息', step: 'filter' },
    { label: '接口信息', step: 'fetch' },
    { label: '列表信息', step: 'table' }
  ],
  'normal-form': [
    { label: '页面信息', step: 'header' },
    { label: '表单信息', step: 'form' },
    { label: '接口信息', step: 'fetch' }
  ],
  'edit-form': [
    { label: '查询接口', step: 'fetch' },
    { label: '页面信息', step: 'header' },
    { label: '表单', step: 'form' },
    { label: '提交接口', step: 'fetch' }
  ],
  'detail': [
    { label: '接口信息', step: 'fetch' },
    { label: '页面信息', step: 'header' },
    { label: '详情信息', step: 'detail' }
  ],
  'opera': [
    { label: '接口信息', step: 'fetch' }
  ]
}